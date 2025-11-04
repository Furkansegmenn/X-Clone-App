import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Comment from "../models/comment.model.js";
import { getAuth } from "@clerk/clerk-sdk-node";
import cloudinary from "../config/cloudinary.js";

export const getPosts = asyncHandler(async (req, res) => {
 const posts = Post.find()
 .sort({ createdAt: -1 })
 .populate('user', 'username firstName lastName profilePicture')
 .populate({
    path: 'comments',
    populate: {
      path: 'user',
      select: 'username firstName lastName profilePicture'
    }   
  })
  res.status(200).json({posts});
});

export const getPost = asyncHandler(async (req, res) => {
  const {postId} = req.params;
  const post = await Post.findById(postId)
  .populate('user', 'username firstName lastName profilePicture')
  .populate({
    path: 'comments',
    populate: {
      path: 'user',
      select: 'username firstName lastName profilePicture'
    }   
  })
  res.status(200).json({post});
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const {username} = req.params;

  const user = await User.findOne({username});
  if(!user) return res.status(404).json({error:"User not found"});

  const posts = await Post.findById(user._id)
  .sort({ createdAt: -1 })
  .populate('user', 'username firstName lastName profilePicture')
  .populate({
    path: 'comments',
    populate: {
      path: 'user',
      select: 'username firstName lastName profilePicture'
    }   
  })    
  res.status(200).json({posts});
});

export const createPost = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req);
    const {content} = req.body;
    const imageFile = req.file;

    if(!content && !imageFile) {
      return res.status(400).json({error: "Post content or image is required"});
    }
    
      const user = await User.findOne({ clerkId: userId });
        if(!user) return res.status(404).json({error:"User not found"});

        let imageUrl = "";

        // upload image to Cloudinary if provided
  if (imageFile) {
    try {
      // convert buffer to base64 for cloudinary
      const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString(
        "base64"
      )}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image);
      imageUrl = uploadResponse.secure_url;
    } catch (error) {
      return res.status(500).json({ error: "Error uploading image to Cloudinary" });
    }
  }

  const post = await Post.create({
    user: user._id,
    content,
    image: imageUrl,
  })
    res.status(201).json({post});
});

export const likePost = asyncHandler(async (req, res) => {
  const {postId} = req.params;
  const {userId} = getAuth(req);

  const user = await User.findOne({clerkId: userId});
  if(!user) return res.status(404).json({error:"User not found"});

  const post = await Post.findById(postId);
  if(!post) return res.status(404).json({error:"Post not found"});

  isLiked = post.likes.includes(user._id);

  if(isLiked) {
    post.likes.pull(user._id);
  } else {
    post.likes.push(user._id);
  }

     if (post.user.toString() !== user._id.toString()) {
      await Notification.create({
        from: user._id,
        to: post.user,
        type: "like",
        post: postId,
      });
    }
    res.status(200).json({message: isLiked ? "Post unliked successfully" : "Post liked successfully"},);
});
  
export const deletePost = asyncHandler(async (req, res) => {
  const {postId} = req.params;
  const {userId} = getAuth(req);

  const user = await User.findOne({clerkId: userId});
  if(!user) return res.status(404).json({error:"User not found"});

  const post = await Post.findById(postId);
  if(!post) return res.status(404).json({error:"Post not found"});

  if(post.user.toString() !== user._id.toString()) {
    return res.status(403).json({error:"You are not authorized to delete this post"});
  }
  await Comment.deleteMany({post: post._id});

  await post.remove();
  
  res.status(200).json({message: "Post deleted successfully"});
});