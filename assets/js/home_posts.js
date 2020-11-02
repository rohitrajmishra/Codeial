{
  // console.log('Inside home_posts.js');
  // Method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");
    // console.log(newPostForm);
    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "POST",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          // console.log("Inside ajax success call..");
          // console.log(data);
          let newPost = new newPostDom(data.data.post);
          console.log(newPost);
          // Prepend newPost
          $('#posts-list-container>ul').prepend(newPost);
          deletePost($('.delete-post-button', newPost));
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // Method to create the post in DOM
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
                <p>

                  <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">
                      <button type="button" name="button">X</button>
                    </a>
                  </small>

                </p>
                <p>
                  ${post.content}
                  <small>
                    ${post.user.name}
                  </small>
                </p>
                <div class="post-comments">

                  <form action="comments/create" method="post">
                    <input type="text" name="content" placeholder="Type here to add comments..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add comment">
                  </form>


                  <div class="post-comments-list">
                    <ul id="post-comments-${post._id}">

                    </ul>
                  </div>
                </div>
              </li>
`);
  };


  // Method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
          type: 'get',
          url: $(deleteLink).prop('href'),
          success: function(data){
            $(`#post-${data.data.post_id}`).remove();
          }, error: function(error){
            console.log(error.responseText);
          }

        })
    })

  }
  createPost();
}
