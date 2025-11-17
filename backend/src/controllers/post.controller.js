import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Comment from "../models/comment.model.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary.js";

export const getPosts = asyncHandler(async (req, res) => {
 const posts = await Post.find()
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
if(!post) return res.status(404).json({error:"Post not found"});
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
  try {
    console.log("=== LIKE POST REQUEST ===");
    const {postId} = req.params;
    const auth = getAuth(req);
    const userId = auth?.userId;
    
    console.log("Post ID:", postId);
    console.log("User ID:", userId);

    if(!userId) {
      console.error("No userId found in request");
      return res.status(401).json({error:"Unauthorized"});
    }

    const user = await User.findOne({clerkId: userId});
 
    if(!user) {
      console.error("User not found for clerkId:", userId);
      return res.status(404).json({error:"User not found"});
    }
    console.log("User found:", user._id);

    const post = await Post.findById(postId);
    if(!post) {
      console.error("Post not found for postId:", postId);
      return res.status(404).json({error:"Post not found"});
    }
    console.log("Post found:", post._id);
    console.log("Current likes:", post.likes);

    const isLiked = post.likes.some(likeId => likeId.toString() === user._id.toString());
    console.log("Is already liked:", isLiked);

    if(isLiked) {
      post.likes.pull(user._id);
      console.log("Removing like");
    } else {
      post.likes.push(user._id);
      console.log("Adding like");
    }

    await post.save();
    console.log("Post saved. New likes:", post.likes);

    if (!isLiked && post.user.toString() !== user._id.toString()) {
      try {
        console.log("Creating notification");
        await Notification.create({
          from: user._id,
          to: post.user,
          type: "like",
          post: postId,
        });
      } catch (notifError) {
        console.error("Error creating notification:", notifError);
        // Don't fail the request if notification creation fails
      }
    }
  
    console.log("=== LIKE POST SUCCESS ===");
    res.status(200).json({message: isLiked ? "Post unliked successfully" : "Post liked successfully"});
  } catch (error) {
    console.error("=== LIKE POST ERROR ===");
    console.error("Error:", error);
    console.error("Error stack:", error.stack);
    throw error; // Let asyncHandler handle it
  }
});
  
export const deletePost = asyncHandler(async (req, res) => {
  try {
    console.log("=== DELETE POST REQUEST ===");
    const {postId} = req.params;
    const auth = getAuth(req);
    const userId = auth?.userId;
    
    console.log("Post ID:", postId);
    console.log("User ID:", userId);

    if(!userId) {
      console.error("No userId found in request");
      return res.status(401).json({error:"Unauthorized"});
    }

    const user = await User.findOne({clerkId: userId});
    if(!user) {
      console.error("User not found for clerkId:", userId);
      return res.status(404).json({error:"User not found"});
    }
    console.log("User found:", user._id);

    const post = await Post.findById(postId);
    if(!post) {
      console.error("Post not found for postId:", postId);
      return res.status(404).json({error:"Post not found"});
    }
    console.log("Post found:", post._id);
    console.log("Post owner:", post.user.toString());
    console.log("Current user:", user._id.toString());

    if(post.user.toString() !== user._id.toString()) {
      console.error("Unauthorized: User is not the owner of the post");
      return res.status(403).json({error:"You are not authorized to delete this post"});
    }
  
    console.log("Deleting comments for post");
    await Comment.deleteMany({post: post._id});

    console.log("Deleting post");
    await post.deleteOne();

    console.log("=== DELETE POST SUCCESS ===");
    res.status(200).json({message: "Post deleted successfully"});
  } catch (error) {
    console.error("=== DELETE POST ERROR ===");
    console.error("Error:", error);
    console.error("Error stack:", error.stack);
    throw error; // Let asyncHandler handle it
  }
});