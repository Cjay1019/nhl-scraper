$("#scrape").on("click", function() {
  $.get("/scrape").then(function() {
    getLatest();
  });
});

$("#articles-section").on("click", ".save", function() {
  var data = { _id: $(this).attr("data-_id") };
  if ($(this).attr("data-clicked") === "yes") {
    $(this)
      .children(".heart")
      .attr("class", "far fa-heart red-text fa-3x heart");
    $(this).attr("data-clicked", "no");
    $.post("/save", data);
  } else {
    $(this)
      .children(".heart")
      .attr("class", "fas fa-heart red-text fa-3x heart");
    $(this).attr("data-clicked", "yes");
    $.post("/save", data);
  }
});

$("#home").on("click", function() {
  $(this)
    .parent()
    .attr("class", "nav-item active");
  $("#articles")
    .parent()
    .attr("class", "nav-item");
  getLatest();
});

$("#articles").on("click", function() {
  $(this)
    .parent()
    .attr("class", "nav-item active");
  $("#home")
    .parent()
    .attr("class", "nav-item");
  getSaved();
});

$("#articles-section").on("click", ".delete", function() {
  var data = { _id: $(this).attr("data-_id") };
  $.post("/delete", data).then(function() {
    getSaved();
  });
});

function getLatest() {
  $.get("/articles").then(function(data) {
    $("#articles-section").empty();
    var header = $("<h2>")
      .attr("class", "h1-responsive font-weight-bold text-center my-5")
      .text("Latest articles");
    $("#articles-section").append(header);
    for (i = 0; i < data.length; i++) {
      var articleRow = $("<div>").attr({
        "data-article-id": data[i]._id,
        class: "row"
      });
      var imgCol = $("<div>").attr("class", "col-lg-5 col-xl-4");
      var imgDiv = $("<div>").attr(
        "class",
        "view overlay rounded z-depth-1-half mb-lg-0 mb-4"
      );
      var img = $("<img>").attr({
        class: "img-fluid",
        src: data[i].image,
        alt: "Article image"
      });
      var mask = $("<div>").attr("class", "mask rgba-white-slight");
      var bodyCol = $("<div>").attr("class", "col-lg-7 col-xl-8");
      var title = $("<h3>")
        .attr("class", "font-weight-bold mb-3")
        .text(data[i].title);
      var preview = $("<p>")
        .attr("class", "dark-grey-text")
        .text(data[i].preview);
      var link = $("<a>")
        .text("Read more")
        .attr({
          href: `https://www.nhl.com/${data[i].link}`,
          target: "_blank",
          class: "btn btn-primary btn-md"
        });
      var button = $("<button>").attr({
        class: "btn btn-link btn-md save",
        "data-clicked": "no",
        "data-_id": data[i]._id
      });
      var icon = $("<i>").attr("class", "far fa-heart red-text fa-3x heart");
      var divider = $("<hr>").attr("class", "my-5");

      // Append everything
      button.append(icon);
      imgDiv.append(img, mask);
      imgCol.append(imgDiv);
      bodyCol.append(title, preview, link, button);
      articleRow.append(imgCol, bodyCol);
      $("#articles-section").append(articleRow);
      $("#articles-section").append(divider);
    }
  });
}

function getSaved() {
  $.get("/saved").then(function(data) {
    $("#articles-section").empty();
    var header = $("<h2>")
      .attr("class", "h1-responsive font-weight-bold text-center my-5")
      .text("Saved articles");
    $("#articles-section").append(header);
    for (i = 0; i < data.length; i++) {
      var articleRow = $("<div>").attr({
        "data-article-id": data[i]._id,
        class: "row"
      });

      var imgCol = $("<div>").attr("class", "col-lg-5 col-xl-4");
      var imgDiv = $("<div>").attr(
        "class",
        "view overlay rounded z-depth-1-half mb-lg-0 mb-4"
      );
      var img = $("<img>").attr({
        class: "img-fluid",
        src: data[i].image,
        alt: "Article image"
      });
      var mask = $("<div>").attr("class", "mask rgba-white-slight");
      var bodyCol = $("<div>").attr("class", "col-lg-7 col-xl-8");
      var title = $("<h3>")
        .attr("class", "font-weight-bold mb-3")
        .text(data[i].title);
      var preview = $("<p>")
        .attr("class", "dark-grey-text")
        .text(data[i].preview);
      var link = $("<a>")
        .text("Read more")
        .attr({
          href: `https://www.nhl.com/${data[i].link}`,
          target: "_blank",
          class: "btn btn-primary btn-md"
        });
      var deleteButton = $("<button>").attr({
        class: "btn btn-danger btn-md delete",
        "data-_id": data[i]._id
      });
      var notesButton = $("<button>")
        .text("Notes")
        .attr({
          class: "btn btn-success btn-md notes",
          "data-_id": data[i]._id
        });
      var icon = $("<i>").attr("class", "fas fa-times fa-lg x");
      var divider = $("<hr>").attr("class", "my-5");

      // Append everything
      deleteButton.append(icon);
      imgDiv.append(img, mask);
      imgCol.append(imgDiv);
      bodyCol.append(title, preview, link, notesButton, deleteButton);
      articleRow.append(imgCol, bodyCol);
      $("#articles-section").append(articleRow);
      if (i !== data.length + 1) {
        $("#articles-section").append(divider);
      }
    }
  });
}
