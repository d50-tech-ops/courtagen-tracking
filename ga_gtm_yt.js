//Based on code originated by LunaMetrics http://www.lunametrics.com @lunametrics 
//and Sayf Sharif @sayfsharif
//Modified by Howard Blazzard - d50Media, to pass events to GTM DataLayer
//updated 12/5/2013

//instantiate youtube player api 




var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var videoArray = new Array();
var playerArray = new Array();


(function($) {
	function trackYouTube()
	{
	
		var i = 0;

		jQuery('iframe').each(function() {

			var video = $(this);

			if(video.attr('src')===undefined){
				var vidSrc = "";
			}else{
				var vidSrc = video.attr('src');
			}

			

			var regex = /h?t?t?p?s?\:?\/\/www\.youtube\.com\/embed\/([\w-]{11})(?:\?.*)?/;

			var matches = vidSrc.match(regex);
			
			if(matches && matches.length > 1){
					
					videoArray[i] = matches[1];
					
					$(this).attr('id', matches[1]);
					
					i++;			
			}
		});	
	}
	
	$(document).ready(function() {
	trackYouTube();
	});
})(jQuery);

function onYouTubeIframeAPIReady() {
	
	for (var i = 0; i < videoArray.length; i++) {
		playerArray[i] = new YT.Player(videoArray[i], {
			events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
			}
		});		
	}
}

function onPlayerReady(event) {
	//event.target.playVideo();
}

var _pauseFlag = false;

function getIdFromUrl(url) {
	var regex = /[?&]v=([^&]+)/;
	var match = url.match(regex);
	url = match[1];
	return url;
	}
	
function onPlayerStateChange(event) { 

	//videoarraynum = event.target.id - 1;
	var videoID;
	var url = event.target.getVideoUrl();	
	videoID = getIdFromUrl(url);

	if (event.data ==YT.PlayerState.PLAYING){

		dataLayer.push({
		'event': 'You Tube Videos',
		'event_type': 'Play',
		'video_id':videoID
		}); 
		
		_pauseFlag = false;
	} 
	//should the video tire out and cease
	if (event.data ==YT.PlayerState.ENDED){
		dataLayer.push({
		'event': 'You Tube Videos',
		'event_type': 'Watch to End',
		'video_id':videoID
		}); 
	} 

	if (event.data ==YT.PlayerState.PAUSED && _pauseFlag == false){
		
		dataLayer.push({
		'event': 'You Tube Videos',
		'event_type': 'Pause',
		'video_id':videoID
		}); 
		_pauseFlag = true;
	}

	if (event.data ==YT.PlayerState.BUFFERING){
		dataLayer.push({
		'event': 'You Tube Videos',
		'event_type': 'Buffering',
		'video_id':videoID 
		}); 
	}
	//and should it cue
	//for why not track this as well.
	if (event.data ==YT.PlayerState.CUED){
		dataLayer.push({
		'event': 'You Tube Videos',
		'event_type': 'Cueing',
		'video_id':videoID 
		}); 
	} 
} 