const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments_mailer");
const queue = require('../config/kue');
const commentEmailWorker = require("../workers/comment_email_worker");

module.exports.create = async function(req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      post.comments.push(comment);
      post.save();

      comment = await comment.populate("user", "name email").execPopulate();
      // // Send email
      // commentsMailer.newComment(comment);

      // Enqueue the task
      let job = queue.create("emails", comment).save(function(err) {
        if (err) {
          console.log("error in creating emails queue ", err);
          return;
        }

        console.log("job enqueued ", job.id);
      });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Post created!",
        });
      }

      req.flash("success", "Comment published");

      res.redirect("/");
    }
  } catch (err) {
    console.log("Error: ", err);
  }
};

module.exports.destroy = async function(req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    if (comment.user == req.user.id) {
      // First save the id of post to which this comment belongs
      let postId = comment.post;

      // Remove the comment
      comment.remove();

      // Remove the comment id from the relevant post
      let post = await Post.findByIdAndUpdate(postId, {
        $pull: {
          comments: req.params.id,
        },
      });
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error: ", err);
  }
};
