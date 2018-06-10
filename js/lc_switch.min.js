/**
 * lc_switch.js
 * Version: 1.0
 * Author: LCweb - Luca Montanari
 * Website: http://www.lcweb.it
 * Licensed under the MIT license
 */

(function(a){if("undefined"!=typeof a.fn.lc_switch)return!1;a.fn.lc_switch=function(d,f){a.fn.lcs_destroy=function(){a(this).each(function(){a(this).parents(".lcs_wrap").children().not("input").remove();a(this).unwrap()});return!0};a.fn.lcs_on=function(){a(this).each(function(){var b=a(this).parents(".lcs_wrap"),c=b.find("input");"function"==typeof a.fn.prop?b.find("input").prop("checked",!0):b.find("input").attr("checked",!0);b.find("input").trigger("lcs-on");b.find("input").trigger("lcs-statuschange");
b.find(".lcs_switch").removeClass("lcs_off").addClass("lcs_on");if(b.find(".lcs_switch").hasClass("lcs_radio_switch")){var d=c.attr("name");b.parents("form").find("input[name="+d+"]").not(c).lcs_off()}});return!0};a.fn.lcs_off=function(){a(this).each(function(){var b=a(this).parents(".lcs_wrap");"function"==typeof a.fn.prop?b.find("input").prop("checked",!1):b.find("input").attr("checked",!1);b.find("input").trigger("lcs-off");b.find("input").trigger("lcs-statuschange");b.find(".lcs_switch").removeClass("lcs_on").addClass("lcs_off")});
return!0};return this.each(function(){if(!a(this).parent().hasClass("lcs_wrap")){var b="undefined"==typeof d?"ON":d,c="undefined"==typeof f?"OFF":f,b=b?'<div class="lcs_label lcs_label_on">'+b+"</div>":"",c=c?'<div class="lcs_label lcs_label_off">'+c+"</div>":"",g=a(this).is(":disabled")?!0:!1,e=a(this).is(":checked")?!0:!1,e=""+(e?" lcs_on":" lcs_off");g&&(e+=" lcs_disabled");b='<div class="lcs_switch '+e+'"><div class="lcs_cursor"></div>'+b+c+"</div>";!a(this).is(":input")||"checkbox"!=a(this).attr("type")&&
"radio"!=a(this).attr("type")||(a(this).wrap('<div class="lcs_wrap"></div>'),a(this).parent().append(b),a(this).parent().find(".lcs_switch").addClass("lcs_"+a(this).attr("type")+"_switch"))}})};a(document).ready(function(){a(document).delegate(".lcs_switch:not(.lcs_disabled)","click tap",function(d){a(this).hasClass("lcs_on")?a(this).hasClass("lcs_radio_switch")||a(this).lcs_off():a(this).lcs_on()});a(document).delegate(".lcs_wrap input","change",function(){a(this).is(":checked")?a(this).lcs_on():
a(this).lcs_off()})})})(jQuery);
