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
    });
    $('.js-vid-info').mouseout(function(){
       $(this).children('.js-edit-vid-attrs').first().addClass("is-hidden");
    });

    //clicking eraser makes text fields editable for description and title
    $('.js-edit-vid-attrs').click(function(){
        var $thisTitle = $(this).parent().find('.title:first')
        var $thisDescr = $(this).parent().find('.descr:first')

        $thisTitle.addClass('is-hidden');
        $thisDescr.addClass('is-hidden');
        $(this).parent().find('.edit-title:first').removeClass('is-hidden');
        $(this).parent().find('.edit-descr:first').removeClass('is-hidden');
        $(this).parent().find('.edit-title:first').val($thisTitle.text());
        $(this).parent().find('.edit-descr:first').val($thisDescr.text());

    });



});
