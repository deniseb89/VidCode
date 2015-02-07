jQuery(document).ready(function() {
    jQuery('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');

        // Show/Hide Tabs
        jQuery('.tabs ' + currentAttrValue).show().siblings().hide();

        // Change/remove current tab to active
        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');

        e.preventDefault();
    });

	$(function () {
	    $('.tab-content').on('click', '.js-delete-vid', function (evt) {
	        if (confirm('Are you sure you want to delete this item?')) {
	            deleteItem($(evt.target).data('id'));
	        }
	    });
	});

    //in the profile page, on video hover the edit icon appears
    $('.js-vid-info').mouseover(function(){
        $(this).children('.js-edit-vid-attrs').first().removeClass("is-hidden");
        $(this).children('.js-delete-vid').first().removeClass("is-hidden");
    });
    $('.js-vid-info').mouseout(function(){
        $(this).children('.js-edit-vid-attrs').first().addClass("is-hidden");
        $(this).children('.js-delete-vid').first().addClass("is-hidden");
    });

    //clicking eraser makes text fields editable for description and title
    $('.tabs').on('click', '.js-edit-vid-attrs', function(){
        var $thisTitle = $(this).parent().find('.title:first')
        var $thisDescr = $(this).parent().find('.descr:first')
        var $thisTitleEdit = $(this).parent().find('.edit-title:first');
        var $thisDescrEdit = $(this).parent().find('.edit-descr:first');
        var $xBtnShowing = $(this).parent().find('.js-delete-vid:first');

        $thisTitle.addClass('is-hidden');
        $thisDescr.addClass('is-hidden');
        $thisTitleEdit.removeClass('is-hidden');
        $thisDescrEdit.removeClass('is-hidden');
        $thisTitleEdit.val($thisTitle.text());
        $thisDescrEdit.val($thisDescr.text());

        $(this).children().attr("src", "/img/icons/check-save.png");

        $xBtnShowing.removeClass('js-delete-vid');
        $xBtnShowing.addClass('js-delete-vid-showing');

        $(this).removeClass('js-edit-vid-attrs');
        $(this).addClass('js-save-vid-attrs');
    });

    $('.tabs').on('click', '.js-save-vid-attrs', function(){
        var $thisTitle = $(this).parent().find('.title:first');
        var $thisDescr = $(this).parent().find('.descr:first');
        var $thisTitleEdit = $(this).parent().find('.edit-title:first');
        var $thisDescrEdit = $(this).parent().find('.edit-descr:first');
        var $xBtnShowing = $(this).parent().find('.js-delete-vid-showing:first');

        $thisTitle.text($thisTitleEdit.val());
        $thisDescr.text($thisDescrEdit.val());

        $thisTitle.removeClass('is-hidden');
        $thisDescr.removeClass('is-hidden');

        $thisTitleEdit.addClass('is-hidden');
        $thisDescrEdit.addClass('is-hidden');

        $(this).children().attr("src", "/img/icons/eraser.png");

        $xBtnShowing.addClass('js-delete-vid');
        $xBtnShowing.removeClass('js-delete-vid-showing');

        $(this).addClass('js-edit-vid-attrs');
        $(this).removeClass('js-save-vid-attrs');
    });



});
