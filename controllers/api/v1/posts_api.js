const Post = require("../../../models/post");
const User = require("../../../models/user");
const Comment = require("../../../models/comment");

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });

  return res.json(200, {
    message: "List of posts",
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    // id is automatic conversion to string from _id
    if (post.user == req.user.id) {
      post.remove();

      await Comment.deleteMany({
        post: req.params.id,
      });

      // req.flash('success', 'Post and associated comments deleted!');
      // return res.redirect('back');

      return res.json(200, {
        message: "Post and associated comments deleted successfully!",
      });
    } else {
      // req.flash('error', 'You can not delete this post!');
      // return res.redirect('back');
      return res.json(401, {
        message: "You can not delete this post",
      });
    }
  } catch (err) {
    // req.flash('error', err);
    console.log("***********Error", err);
    return res.json(500, {
      message: "Internal server error",
    });
  }
};
