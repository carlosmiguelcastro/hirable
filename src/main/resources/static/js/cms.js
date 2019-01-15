function addItem(groupid) {
  var contentElements = $("#" + groupid);
  var numberOfElements = parseInt(contentElements.attr("data-length"));
  var element = $("#" + groupid + "-" + (numberOfElements - 1));
  var index = parseInt(element.attr("data-index"));

  contentElements.attr("data-length", numberOfElements + 1);
  var newElement = element.clone();
  var newIndex = index + 1;
  newElement.attr("data-index", newIndex);
  newElement.attr("id", groupid + "-" + newIndex);

  newElement.children().find(":button").attr("id", groupid + "-deleteButton-" + newIndex);
  newElement.children().find(":button").attr("onclick", "javascript:deleteItem(" + newIndex + ",'" + groupid + "')");

  newElement.insertAfter(element);

  updateAttributeOnChildren(newElement, newIndex);
}

function deleteItem(index, groupid) {
  var contentElements = $("#" + groupid);
  var numberOfElements = parseInt(contentElements.attr("data-length"));
  if (numberOfElements === 1) {
    return;
  }

  var element = $('#' + groupid + '-' + index);
  for (var i = numberOfElements - 1; i > index; i--) {
    var nextElem = $("#" + groupid + "-" + i);
    var nextElemIndex = i - 1;
    nextElem.attr("id", groupid + "-" + nextElemIndex);
    nextElem.attr("data-index", nextElemIndex);

    nextElem.children().find(":button").attr("id", groupid + "-deleteButton-" + nextElemIndex);
    nextElem.children().find(":button").attr("onclick", "javascript:deleteItem(" + nextElemIndex + ",'" + groupid + "')");

    updateAttributeOnChildren(nextElem, nextElemIndex);
  }

  contentElements.attr("data-length", numberOfElements - 1);
  element.remove();
}

function updateAttributeOnChildren(nextElem, nextElemIndex) {
  var children = nextElem.find($("[name*='content[']"));
  children.each(function () {
    var dataFieldName = this.getAttribute("data-field-name");
    var dataNamespace = this.getAttribute("data-namespace");
    this.setAttribute("name", dataNamespace + "[" + nextElemIndex + "][" + dataFieldName + "]");
  });
}

