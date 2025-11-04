import asyncHandler from 'express-async-handler';
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getAuth } from "@clerk/express";


export const getCommentsByPost = asyncHandler(async (req, res) => {
  const {postId} = req.params;

  const comments = await Comment.find({post: postId})
  .sort({ createdAt: -1 })
  .populate('user', 'username firstName lastName profilePicture');

  res.status(200).json({comments});
});

export const createComment = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req);
    const {content} = req.body;
    const {postId} = req.params;

    if(!content || content.trim() === "") {
      return res.status(400).json({error: "Comment content is required"});
    }
    
      const user = await User.findOne({ clerkId: userId });
        if(!user) return res.status(404).json({error:"User not found"});

      const post = await Post.findById(postId);
        if(!post) return res.status(404).json({error:"Post not found"});

      const Comment = new Comment({
        user: user._id,
        post: post._id,
        content
      });

      await Comment.save();

      if (post.user.toString() !== user._id.toString()) {
        await Notification.create({
          from: user._id,
          to: post.user,
          type: "comment",
          post: postId,
          comment: Comment._id
        });
      }

      // Add comment to post's comments array
      post.comments.push(Comment._id);
      await post.save();

      const populatedComment = await Comment.findById(Comment._id)
      .populate('user', 'username firstName lastName profilePicture');

      res.status(201).json({comment: populatedComment});
});

export const deleteComment = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req);
    const {commentId} = req.params;

    const user = await User.findOne({ clerkId: userId });
      if(!user) return res.status(404).json({error:"User not found"});

    const comment = await Comment.findById(commentId);
      if(!comment) return res.status(404).json({error:"Comment not found"});

    // Check if the user is the owner of the comment
    if(comment.user.toString() !== user._id.toString()) {
      return res.status(403).json({error: "You are not authorized to delete this comment"});
    }

    // Remove comment from post's comments array
    const post = await Post.findById(comment.post);
    if(post) {
      post.comments = post.comments.filter(cId => cId.toString() !== comment._id.toString());
      await post.save();
    }

    await comment.remove();

    res.status(200).json({message: "Comment deleted successfully"});
});