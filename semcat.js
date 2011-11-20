	$(function() {
		$( "#catalog" ).accordion({
      autoHeight: false, 
      collapsible: true,
		});
		$( "#catalog li" ).draggable({
			appendTo: "body",
			helper: "clone"
		});
		$( "#record ul" ).droppable({
			activeClass: "ui-state-default",
			hoverClass: "ui-state-hover",
			accept: ":not(.ui-sortable-helper)",
			drop: function( event, ui ) {
				// $( this ).find( ".placeholder" ).remove();
				$( "<li></li>" ).append( '<span class="predicate">' + ui.draggable.text() + '</span>' ).append( ' <input type="text" class="object" />' ).appendTo( this );
			}
		}).sortable({
			items: "li:not(.placeholder)",
			sort: function() {
				// gets added unintentionally by droppable interacting with sortable
				// using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
				$( this ).removeClass( "ui-state-default" );
			}
		});
		$("#uniqueid").val(uuidGenerator());
		$( "input:button", ".demo" ).button();
		$("#generate").click(function () {generateRDF();});
	});
	
	function generateRDF() {
	
	  var intro = "";
	  var triples = "";
	  var foundprefixes = new Array();
	  
	  var prefixes = new Array();
	  prefixes['dcterms'] = 'http://purl.org/dc/elements/1.1/';
    prefixes['bibo']    = 'http://purl.org/ontology/bibo/';
    prefixes['rdf']     = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
    prefixes['foaf']    = 'http://xmlns.com/foaf/0.1/';
    prefixes['prism']   = 'http://prismstandard.org/namespaces/1.2/basic/';
    prefixes['event']   = 'http://purl.org/NET/c4dm/event.owl#';
	
	  // Empty preview area
	  $("#preview").empty();
	
	  // Walk through the record's inputs and build triples
	  $("#record li").each(function () {
	    var s = $("#uniqueid").val();
	    var p = $(this).children(".predicate").text();
	    var o = $(this).children(".object").val();
	    if (o != "") {
	      if (isNaN(o)) {
				  if (o.match(/http/i)) {
				    o  = "<" + o + ">";
				  } else {
				    o = "\"" + o + "\"";
				  }
			  } else {
				  if (o.match(/^([0-9]*|\d*\.\d{1}?\d*)$/)) {
					  o = "\"" + o + "\"";
				  } else {
					  o = "\"" + o + "\"^^xsd:integer";
				  }
			  }
	      var triple = ":" + s + " " + p + " " + o + " .\n";
	      triples += triple;
	      // Collect the unique prefixes
	      var pieces = p.split(":");
	      foundprefixes[pieces[0]] = 1;
	    }
	  });
	  
	  // Build the intro
	  intro += "@prefix : <http://example.org/> .\n";
	  for (var prefix in foundprefixes) {
	    intro += "@prefix " + prefix + ": <" + prefixes[prefix] + "> .\n";
    }
	  
	  $("#preview").val(intro + "\n" + triples);
	
	}
	
	function uuidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

