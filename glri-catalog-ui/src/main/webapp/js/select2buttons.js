/**
 * .select2Buttons - Convert standard html select into button like elements
 *
 * Version: 1.0.1
 * Updated: 2011-04-14
 *
 *  Provides an alternative look and feel for HTML select buttons, inspired by threadless.com
 *
 * Author: Sam Cavenagh (cavenaghweb@hotmail.com)
 * Doco and Source: https://github.com/o-sam-o/jquery.select2Buttons
 *
 * Licensed under the MIT
 **/
jQuery.fn.select2Buttons = function(options) {
  return this.each(function(){
    var select = $(this);
    select.hide();

    var buttonsHtml = $('<div class="select2Buttons"></div>');
    var selectIndex = 0;
    var addOptGroup = function(optGroup){
      if (optGroup.attr('label')){
        buttonsHtml.append('<strong>' + optGroup.attr('label') + '</strong>');
      }

      // there is an incompatibility with angluar where ng adds a default empty value that this tool cannot handle
      var indexDelta = 0;

      var ulHtml =  $('<ul class="select-buttons">');
      optGroup.children('option').each(function(){
        var liHtml = $('<li></li>');
        
        // there is an incompatibility with angluar where ng adds a default empty value that this tool cannot handle
        if ($(this).html() === '') {
          liHtml = '';
          indexDelta = 1;
        } else if ($(this).attr('disabled') || select.attr('disabled')){
          liHtml.addClass('disabled');
          liHtml.append('<span>' + $(this).html() + '</span>');
        } else {
          // there is an incompatibility with angluar where ng adds a default empty value that this tool cannot handle
          liHtml.append('<a href="#" data-select-index="' + (selectIndex-indexDelta) + '">' + $(this).html() + '</a>');
        }

        // Mark current selection as "picked"
        // there is an incompatibility with angluar where ng adds a default empty value that this tool cannot handle
        if ((!options || !options.noDefault) && select.attr("selectedIndex") == selectIndex-indexDelta){
          liHtml.children('a, span').addClass('picked');
        }
        ulHtml.append(liHtml);
        selectIndex++;
      });
      buttonsHtml.append(ulHtml);
      buttonsHtml.append("<div style=\"clear: both;\"></div>");
    }

    var optGroups = select.children('optgroup');
    if (optGroups.length == 0) {
      addOptGroup(select);
    } else {
      optGroups.each(function(){
        addOptGroup($(this));
      });
    }

    select.after(buttonsHtml);

    buttonsHtml.find('a').click(function(e){
      e.preventDefault();

      buttonsHtml.find('a, span').removeClass('picked');
      $(this).addClass('picked');
      $(select.find('option')[$(this).attr('data-select-index')]).attr('selected', 'selected');
      select.trigger('change');
      
      // there is an incompatibility with angular where ng requires this repeat call for the initial selection
      // this could be DRYer and it could also only fire on initial selection
      $(select.find('option')[$(this).attr('data-select-index')]).attr('selected', 'selected');
      select.trigger('change');
    });
  });
};

jQuery.fn.refreshSelect2Button = function(options) {
	return this.each(function(){
		var select = $(this);
		var buttonsHtml = select.next()
		var selectedText = select.find('option[value="'+select.val()+'"]').text();
		
		buttonsHtml.find('a, span').removeClass('picked');
		buttonsHtml.find('a').filter(function() {
		    return $(this).text() === selectedText;
		}).addClass('picked');
	});
};