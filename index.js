/* @overview es6-promise - a tiny implementation of Promises/A+.
* @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
* @license   Licensed under MIT license
*            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
* @version   2.3.0
*/
$(document).ready(function() {
  var el = $('#box-item-product');
  if (el) {
    el.owlCarousel({
        items:1,
        nav:false,
        loop: (el.find('.owl-video').not('.cloned').size()) > 1 ? true : false,
        margin:10,
        video:true,
        lazyLoad:false,
        videoWidth: '100%',
        videoHeight: '256px',
    });
  }
  prevNextOwlCarousel('owl-carousel-product','box-item-product','product-carousel');
  
  disabledAllowFullScreenVideo('owl-carousel-product')

  getEmbeddedInstagram();

  getEmbeddedTwitter();

  getLastPostFB();

  checkVimeoFirstVideo();
});

function disabledAllowFullScreenVideo(social_slide_id = ''){
  $('#'+social_slide_id).on('click','.owl-video-play-icon',function(e){
    $('#'+social_slide_id).find('iframe').removeAttr('webkitallowfullscreen , mozallowfullscreen , allowfullscreen');
  });
}

function checkVimeoFirstVideo(){
  var item_first = $('#box-item-product').find('.owl-item').not('.cloned').eq(0);
  var item_cloned_near_end = $('#box-item-product').find('.owl-item').not('.cloned').eq(-1).next().find('.owl-video-wrapper');
  var type_style = '';
  setTimeout(function(e){
    type_style = item_first.find('.owl-video-tn').attr('style');
    item_cloned_near_end.append('<div class="owl-video-tn" style="'+type_style+'"></div>');
  },1000);
  item_cloned_near_end.append('<div class="owl-video-play-icon"></div>');
}

function getEmbeddedInstagram() {

    if(INSTAGRAM_PAGE) {
        // $.ajax({
        //   url: 'https://api.instagram.com/oembed',
        //   crossDomain: true,
        //   data: {
        //     url: INSTAGRAM_PAGE
        //   },
        //   success: function(response) {
        //     console.log(response);
        //     $('#instagram').html(response.html);
        //   },
        //   dataType: 'jsonp'
        // });

        var instagramwww = 'http://www.instagram.com';
        var instagramswww = 'https://www.instagram.com';
        var instagramnonwww  = 'http://instagram.com';
        var instagramsnonwww  = 'https://instagram.com';

        INSTAGRAM_PAGE = INSTAGRAM_PAGE.replace(instagramwww, '').replace(instagramswww, '').replace(instagramnonwww, '').replace(instagramsnonwww, '').replace(/(\?[a-zA-Z0-9&=-]+)/, '').replace(/^\//, '').replace(/\/$/, '');
        var instagramService = initInstagramService();
        instagramService.searchProfile(INSTAGRAM_PAGE);

    } else {
      $('#instagram').remove();
    }
}

function getEmbeddedTwitter() {
    if (!TWITTER_PAGE) {
      $('#twitter').remove();
    }
    var twtwww     = 'http://www.twitter.com';
    var twtswww    = 'https://www.twitter.com';
    var twtNonWWW  = 'http://twitter.com';
    var twtsNonWWW = 'https://twitter.com';
    TWITTER_PAGE = TWITTER_PAGE.replace(twtwww, '').replace(twtswww, '').replace(twtNonWWW, '').replace(twtsNonWWW, '').replace(/(\?[a-zA-Z0-9&=-]+)/, '').replace(/^\//, '').replace(/\/$/, '');
    $.ajax({
      url: 'https://cdn.syndication.twimg.com/timeline/profile',
      crossDomain: true,
      contentType: "javascript/json",
      dateType: "jsonp",
      data: {
        callback: 'testing',
        dnt: false,
        domain: 'products.tapnfeel.dev',
        lang: 'en',
        screen_name: TWITTER_PAGE,
        suppress_response_codes: true,
        // &t=1642989&
        tweet_limit: 3,
        with_replies: false
      },
      success: function(response) {
        console.log(response);
        if(TWITTER_PAGE != ''){
          $('#twitter').find('.name-social').text('@'+TWITTER_PAGE);
        }
        var body = response.body ? response.body : '';
        var reg = /data-tweet-id="(\d+)"/g;
        var matches = body.match(reg);
        if (matches !== null) {
          reg = /\d+/;
          var total_tweets = matches.length;
          var count = 0;
          for (var i = 0; i < matches.length; i++) {
            var match = matches[i].match(reg);
            if (match !== null) {
              var item_active = i == 0 ? "active" : '';
              var item = $('<div id="tweet'+(i+1)+'" class="item tweet'+(i+1)+' '+ item_active+'" ></div>');
              $("#twitter .carousel-inner").append(item);
              $("#twitter .carousel-indicators").append('<li data-target="#twitter-owl" data-slide-to="'+i+'" class="'+item_active+'"></li>');
              twttr.widgets.createTweet(
                match[0],
                document.getElementById('tweet'+ (i+1)),
                {
                  conversation: 'none',
                  width: 550
                }
              ).then(function(element) {
                  count = count + 1;
                  if(count == total_tweets) {
                    setTimeout(function() {
                      setTimeout(function() {
                        $("#twitter-owl").carousel({pause: true,interval: false});
                        beforeAfterActiveItemSlide('twitter-owl');
                        prevNextOwlCarousel('twitter','twitter-owl');
                        showButtonSlide('twitter',$('#twitter-owl').find('.carousel-inner .item').not('.cloned').size());
                      },500);
                    }, 1500);
                  }
              });
            }
          }

        } else {
          // Delete the Twitter section
          $('#twitter').remove();
        }
      },
      dataType: 'jsonp'
    });
}

function getLastPostFB() {
    if(FACEBOOK_PAGE || FACEBOOK_PROFILE_ID) {
        if(FACEBOOK_PROFILE_TYPE == 'page'){
          var fbHttp     = "http://facebook.com";
          var fbHttps    = "https://facebook.com";
          var fbHttpwww  = "http://www.facebook.com";
          var fbHttpswww = "https://www.facebook.com";
          var fbHttpweb  = "http://web.facebook.com";
          var fbHttpsweb = "https://web.facebook.com";
          FACEBOOK_PAGE = FACEBOOK_PAGE.replace(fbHttp, '').replace(fbHttps, '').replace(fbHttpwww, '').replace(fbHttpswww, '').replace(fbHttpweb, '').replace(fbHttpsweb, '').replace(/(\?[a-zA-Z0-9&=-]+)/, '').replace(/^\//, '').replace(/\/$/, '');
          $.ajax({
            url: 'https://graph.facebook.com/v2.8/'+FACEBOOK_PAGE,
            crossDomain: true,
            data: {
              access_token: access_token_app,
            },
            success: function(response) {
              if (response && response.id) {
                generateItemFacebook(response);
              } else {
                $('#facebook').remove();
              }
            },
            dataType: 'jsonp'
          });
        }else if(FACEBOOK_PROFILE_TYPE == 'profile'){
          setTimeout(function(){
            FB.api('/'+FACEBOOK_PROFILE_ID+'?access_token='+access_token_app, function(result) {
              generateItemFacebook(result);
            });
          },500);
        }
    } else {
      $('#facebook').remove();
    }
}

function generateItemFacebook(response){
  if(response.name != '') $('#facebook').find('.name-social').text('@'+response.name);
  if(typeof FB === 'undefined') return false;
  FB.api('/'+response.id+'/posts?access_token='+access_token_app, function(posts_result) {
     if(posts_result != ''){ 
      if(posts_result.data.length == 0) {
        $('#facebook').find('.message-empty-item').removeClass('hidden'); return false;
      }
      for (var i = 0; i < posts_result.data.length; i++) {
        var owner_id_posts = posts_result.data[i].id.split('_');
        var owner_post = owner_id_posts[0];
        var id_post = owner_id_posts[1];
        if(i == 0){
          var item_active = "active";
        }else if(i == 3){
          break;
        }else{
          item_active = "";
        }
        var item = '<div class="clone-item '+item_active+'" ><div class="fb-post" data-width="auto"  data-href="https://www.facebook.com/'+owner_post+'/posts/'+id_post+'" data-show-text="true"></div></div>';
        $("#facebook .carousel-inner").append(item);
        $("#facebook .carousel-indicators").append('<li data-target="#facebook-owl" data-slide-to="'+i+'" class="'+item_active+'"></li>');
      }
      FB.XFBML.parse(document.getElementById('#facebook'), function() {
        setTimeout(function() {
          $("#facebook-owl").find('.clone-item').addClass('item'); // fix responsive item
          $("#facebook-owl").carousel({pause: true,interval: false});
          prevNextOwlCarousel('facebook','facebook-owl');
          beforeAfterActiveItemSlide('facebook-owl');
          showButtonSlide('facebook',$('#facebook-owl').find('.item').not('.cloned').size());
        }, 1500);
      });
    }else{
      $('#facebook').remove();
    }
  });
}

function searchInstagramProfile(profile_name, access_token) {
  $.ajax({
    url: 'https://api.instagram.com/v1/users/search',
    crossDomain: true,
    data: {
      access_token: access_token,
      q: profile_name,
      count: 1
    },
    success: function(response) {
      if (response && response.data && response.data[0]) {
      }
    },
    dataType: 'jsonp'
  });
}

function initInstagramService () {
  return {
    access_token: '260796206.0efbe26.89a76a9668934089a2d00d928486fd26',
    // access_token: '4154501831.f761f4b.29943d7b42e94cda8f93411b57cf40b7',
    total: 0,
    count: 0,

    searchProfile: function(name) {
      var _service = this;
      $.ajax({
        url: 'https://api.instagram.com/v1/users/search',
        crossDomain: true,
        data: {
          access_token: _service.access_token,
          q: name,
          count: 1
        },
        success: function(response) {
          if(name != ''){
            $('#instagram').find('.name-social').text('@'+name);
          }
          if (response && response.data && response.data[0]) {
            _service.getRecentMedia(response.data[0].id);
          } else {
            _service.abort();
          }
        },
        dataType: 'jsonp'
      });
    },

    getRecentMedia: function(user_id) {
      var _service = this;
      $.ajax({
        url: 'https://api.instagram.com/v1/users/'+user_id+'/media/recent',
        crossDomain: true,
        data: {
          access_token: _service.access_token,
          count: 3
        },
        success: function(response) {
          if (response && response.data && response.data[0]) {
            _service.count = 0;
            _service.total = response.data.length;
            for (var i = 0; i < _service.total; i++) {
              var item_active = i == 0 ? "active" : '';
              var item = $('<div id="instagram'+(i+1)+'" class="item '+item_active+'"></div>');
              $('#instagram-owl').find('.carousel-inner').append(item);
              $("#instagram .carousel-indicators").append('<li data-target="#instagram-owl" data-slide-to="'+i+'" class="'+item_active+'"></li>');
              _service.getEmbeddedContent(response.data[i].link);
            }
          } else {
            _service.abort();
          }
        },
        dataType: 'jsonp'
      });
    },

    getEmbeddedContent: function(link) {
      var _service = this;
      $.ajax({
        url: 'https://api.instagram.com/oembed',
        crossDomain: true,
        data: {
          url: link
        },
        success: function(response) {
          _service.count = _service.count + 1;
          $('#instagram'+_service.count).html(response.html);
          if (_service.count == _service.total) {
            setTimeout(function(){
              $("#instagram-owl").carousel({pause: true,interval: false});
              prevNextOwlCarousel('instagram','instagram-owl');
              beforeAfterActiveItemSlide('instagram-owl');
              showButtonSlide('instagram',$('#instagram-owl').find('.item').not('.cloned').size());
            },1500);
          }
        },
        dataType: 'jsonp'
      });
    },
    abort: function() {
      $('#instagram').remove();
    }
  };
}

var type_click = '';

function prevNextOwlCarousel(social_id , social_slide_id , type_slide = ''){
  var btn_prev = $('#'+social_id).find('.btn-prev-slide');
  var btn_next = $('#'+social_id).find('.btn-next-slide');
  btn_prev.on('click',function(e){
    type_click = 'prev';
    if(type_slide == ''){
      $('#'+social_slide_id).carousel('prev');
    }else{
      $('#'+social_slide_id).trigger('prev.owl.carousel',[500]);
    }
  });
  btn_next.on('click',function(e){
    type_click = 'next';
    if(type_slide == ''){
      $('#'+social_slide_id).carousel('next');
    }else{
      $('#'+social_slide_id).trigger('next.owl.carousel',[500]);
    }
  });
}

function beforeAfterActiveItemSlide(social_slide_id){
  $('#'+social_slide_id).on('slid.bs.carousel', function () {
    var height_item = $('#'+social_slide_id).find('.carousel-inner .active').outerHeight(true);
    $('#'+social_slide_id).find('.carousel-inner').animate({ height:height_item+10+'px',},500);
  });
}

function showButtonSlide(social_id,total_item = 0){
  if(total_item > 1) {
    setTimeout(function(e){
      $('#'+social_id).find('.box-btn-slide').removeClass('hidden');
    },1000);
  }
}

/*Pause video youtube*/
var players_youtube = new Array();
function stopVideo(){
  // $('#box-item-product').find('.item div[data-type-video="youtube"]').each(function(key,value){
  // });
  $(players_youtube).each(function(i){
    this.stopVideo();
  });
}
/*End pause video youtube*/

/*Pause video vimeo*/
var players_vimeo = new Array();
function stopAllVideoVimeo(){
  // $('#box-item-product').find('.item div[data-type-video="vimeo"]').each(function(key,value){
  // });
  $(players_vimeo).each(function(i){
    this.unload();
  });
}
/*End pause video vimeo*/
// $(window).scroll(function() {
//     if ($(this).scrollTop() > $('.position-pause-video').offset().top) {
//       setTimeout(function(e){
//         stopVideo();
//         stopAllVideoVimeo();
//       },500);
//     }
// });

	 
