// @ts-nocheck

/******************************************************************************
                                Constants
******************************************************************************/

const DateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const formatDate = (date) => DateFormatter.format(new Date(date));

/******************************************************************************
                                  Run
******************************************************************************/

// Start
displayUsers();

/******************************************************************************
                              Functions
******************************************************************************/

/**
 * Call api
 */
function displayUsers() {
  Http.get("/api/users/all")
    .then((resp) => resp.json())
    .then((resp) => {
      var allUsersTemplate = document.getElementById("all-users-template"),
        allUsersTemplateHtml = allUsersTemplate.innerHTML,
        template = Handlebars.compile(allUsersTemplateHtml);
      var allUsersAnchor = document.getElementById("all-users-anchor");
      allUsersAnchor.innerHTML = template({
        users: resp.users.map((user) => ({
          ...user,
          createdFormatted: formatDate(user.created),
        })),
      });

      console.log(resp.users);
    });
}

// Setup event listener for button click
document.addEventListener(
  "click",
  (event) => {
    var ele = event.target;
    if (ele.matches("#add-user-btn")) {
      addUser();
      event.preventDefault();
    } else if (ele.matches(".edit-user-btn")) {
      showEditView(ele.parentNode.parentNode);
      event.preventDefault();
    } else if (ele.matches(".cancel-edit-btn")) {
      cancelEdit(ele.parentNode.parentNode);
      event.preventDefault();
    } else if (ele.matches(".submit-edit-btn")) {
      submitEdit(ele);
      event.preventDefault();
    } else if (ele.matches(".delete-user-btn")) {
      deleteUser(ele);
      event.preventDefault();
    }
  },
  false,
);

/**
 * Add a new user.
 */
function addUser() {
  var nameInput = document.getElementById("name-input");
  var emailInput = document.getElementById("email-input");

  var data = {
    user: {
      name: nameInput.value,
      email: emailInput.value,
    },
  };

  Http.post("/api/users/add", data).then(() => {
    nameInput.value = "";
    emailInput.value = "";
    displayUsers();
  });
}


/**
 * Show edit view.
 */
function showEditView(userEle) {
  var normalView = userEle.getElementsByClassName("normal-view")[0];
  var editView = userEle.getElementsByClassName("edit-view")[0];
  normalView.style.display = "none";
  editView.style.display = "block";
}

/**
 * Cancel edit.
 */
function cancelEdit(userEle) {
  var normalView = userEle.getElementsByClassName("normal-view")[0];
  var editView = userEle.getElementsByClassName("edit-view")[0];
  normalView.style.display = "block";
  editView.style.display = "none";
}

/**
 * Submit edit.
 */
async function submitEdit(ele) {
  var userEle = ele.parentNode.parentNode;
  var nameInput = userEle.getElementsByClassName("name-edit-input")[0];
  var emailInput = userEle.getElementsByClassName("email-edit-input")[0];
  var id = ele.getAttribute("data-user-id");
  var created = ele.getAttribute("data-user-created");
  var avatarInput = userEle.querySelector(".avatar-input");
  console.log(avatarInput)
  console.log(avatarInput?.files)
  var avatar = avatarInput?.files?.[0];
  var avatarMime = avatarInput?.files?.[0]?.type;
  var avatarBase64 = await fileToBase64(avatarInput.files[0]);


  var data = {
    user: {
      id: Number(id),
      name: nameInput.value,
      email: emailInput.value,
      created: new Date(created),
      avatar: avatarBase64,
      avatarMime: avatarMime,
    },
  };
  console.log(data);
  Http.put("/api/users/update", data).then(() => displayUsers());
}

/**
 * Delete a user
 */
function deleteUser(ele) {
  var id = ele.getAttribute("data-user-id");
  Http.delete("/api/users/delete/" + id).then(() => displayUsers());
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
