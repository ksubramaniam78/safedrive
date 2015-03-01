Spirito = {

    i: 1,
    // Main initalize function
    // @param home: Default true, defines if this is home page or not
    init: function(home) {
        this.settings();
        home = (home !== undefined ? home : true);
        this.homesize();
        this.animated_contents();

        if (home) {
            this.handleNav();
        }
        this.handleScroll();
        this.handleResize();
        this.blog();
        this.themeOptions();
        //this.parallax();

        return this;
    },

    settings: function() {
        Settings.load();
        $('body').attr('data-color',Settings.get('color'));
        $('nav#main').removeClass('dark colored');
        var headC = Settings.get('header');
        if(headC === 'dark' || headC === 'colored') $('nav#main').addClass(headC);
    },

    // Function to handle resize events
    handleResize: function() {
        $this = this;
        if ($(window).width() < 1200) {
            $('#home').attr('style', '');
        }

        if ($(window).width() >= 1200) {
            $('*[data-animate]').addClass('animate');
            if ($('html').hasClass('no-cssanimations')) {
                $('*[data-animate]').css('opacity', '1');
            }
        }

        $this.homesize();

        $(window).resize(function() {
            $this.homesize();
        });
    },

    // Function to handle scroll events
    handleScroll: function() {
        var $this = Spirito;
        $(window).on('scroll', function() {
            if ($(window).width() >= 1200) {
                $this.homeParallax();
                $this.fadeHome();
                $this.animated_contents();
            }
        });

        $('*[data-scroll]').on('click', function() {
            var target = $(this).data('scroll');
            var off = $(window).width() < 401 ? 30 : 50;
            $this.scrollTo(target, off, 1200);
            return false;
        });
    },

    // Function to control navigation
    handleNav: function() {
        $('nav').waypoint('sticky', {
            stuckClass: 'sticky'
        });

        $('nav > div > ul').onePageNav({
            currentClass: 'active',
            changeHash: false,
            scrollSpeed: 700,
            scrollOffset: 60,
            easing: 'swing',
            end: function() {
                if ($(window).width() < 768) {
                    $('.menu-trigger').removeClass('open');
                    $('nav > div > ul').slideUp(300);
                }
            }
        });
        this.toggleMenu();
    },

    // Functions for parallax effect on home main top bg 
    homeParallax: function() {
        if (!$('#home').hasClass('static')) {
            var scrolled = $(window).scrollTop();
            $('#home #maximage .mc-image').css({
                'top': 'auto',
                'bottom': -(scrolled * 0.7) + 'px'
            });
        }
    },

    // Function to hold sliders options and initializers
    initSliders: function() {
        $('.bxslider').bxSlider({
            mode: 'horizontal',
            pager: false,
            controls: false,
            auto: true
        });

        $('#maximage').maximage({
            cycleOptions: {
                fx: 'fade',
                speed: 1500,
                prev: '.img-prev',
                next: '.img-next'
            }
        });

        return this;
    },

    // Function to show or hide menu when screen width < 768
    toggleMenu: function() {
        $('nav#main .menu-trigger').on('click',function(e){
            e.preventDefault();
            if ($('nav#main .menu-trigger').hasClass('open') === false) {
                $('nav#main .menu-trigger').addClass('open');
                $('nav#main > div > ul').stop(false, true).slideDown();
            } else {
                $('nav#main .menu-trigger').removeClass('open');
                $('nav#main > div > ul').stop(false, true).slideUp();
            }
        });
        $(window).on('resize',function(){
            if($(window).width() > 768) {
                $('nav#main > div > ul').attr('style','');
                $('nav#main .menu-trigger').removeClass('open');
            }
        })
    },

    // Function to hold portfolio sort functions and initializers
    initPortfolio: function(element) {
        element = element !== undefined ? element : "#portfolio";
        $(element).mixitup({
            targetSelector: ".portfolio-item",
            effects: ['fade', 'rotateX'],
            onMixStart: function() {
                $('.portfolio-item').css('height', '');
                $('.portfolio-item').removeClass('og-expanded');
                $('.portfolio-item .og-expander').fadeOut('fast').remove();
            }
        });

        return this;
    },

    // Function to init maps
    initMaps: function(element) {

 //           var myFirebaseRef = new Firebase("https://intense-heat-6897.firebaseio.com/");
        var myFirebaseRef = new Firebase("https://alertz.firebaseio.com/");

        var mapme, mapteam;

        require([
            "esri/map", "esri/geometry/Point",
            "esri/symbols/SimpleMarkerSymbol", "esri/graphic",
            "dojo/_base/array", "dojo/dom-style", "dojox/widget/ColorPicker",
            "dojo/domReady!"
        ], function(
            Map, Point,
            SimpleMarkerSymbol, Graphic,
            arrayUtils, domStyle, ColorPicker
            ) {

            mapme = new Map("google-map-me",{
                basemap: "streets",
                center: [-119, 35],
                zoom: 6,
                minZoom: 2
            });

            mapme.on("load", mapLoaded);

            function mapLoaded(){
                var dropMarkerCB = dropMarker;
                var lat, long;
                myFirebaseRef.child('Sreejumon/lat').on("value", function(snapshot) {
                    lat = snapshot.val();
                });
                myFirebaseRef.child('Sreejumon/long').on("value", function(snapshot) {
                    long = snapshot.val();
                    dropMarkerCB([long, lat]);
                    var value = parseInt($(".distractions-me").text(), 10) + 1;
                    $(".distractions-me").text(value);
                });
            }

            function createSymbol(color){
                var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
                markerSymbol.setColor(new dojo.Color(color));
                markerSymbol.setOutline(null);
                return markerSymbol;
            }

            function dropMarker(location) {
                var initColor = "#ce641d";
                var graphic = new Graphic(new Point(location), createSymbol(initColor));
                mapme.graphics.add(graphic);
            }

            mapteam = new Map("google-map-team-1",{
                basemap: "streets",
                center: [-119,35],
                zoom: 6,
                minZoom: 2
            });

            mapteam.on("load", mapteamLoaded);

            function mapteamLoaded() {
                var points = [[-119,35],[-119.5,35.5],[-118,36],[-118.5,36.5],[-117,34],[-117.5,34.5],[-116,33],[-116.5,36.5],[-115,32.5],[-115.5,32],[-110,33],[-120,40],[-125,46],[-122,47],[-127,44],[-129,52],[-120,35.5],[-119.2,35.9]];
                var initColor = "#ce641d";
                arrayUtils.forEach(points, function (point) {
                    var graphic = new Graphic(new Point(point), createSymbol(initColor));
                    mapteam.graphics.add(graphic);
                });
            }
        });
        return this;
    },

    // Function to initialize fade effect on scroll for main home wrapper
    fadeHome: function() {
        //Fade the .home-wrapper
        var ws = $(window).scrollTop(),
            offset = ws / 2;
        $('.home-wrapper, .fullscreen-controls').css({
            transform: 'translateY(' + offset + 'px)',
            opacity: 1 - (ws / 700)
        });

    },

    // Function to correct main home wrapper dimensions
    homesize: function() {
        windowHeight = $(window).height();
        windowWidth = $(window).width();
        elements = $("#home, #maximage, .mc-cycle, #maximage > .mc-image, #home .pattern");
        elements.css({
            'height': 'auto'
        });
        elements.css({
            'height': windowHeight + "px",
            "max-height": windowHeight + "px"
        });
        if ($('body').hasClass('boxed')) {
            $('#maximage, .bxslider li').css({
                'width': "100%"
            });
        } else {
            $('.bxslider li').css({
                'width': windowWidth + "px"
            });
        }
    },

    // Function for parallax effect
    parallax: function() {
        $('#quote').parallax("50%", 0.5);
        $('#clients').parallax("50%", 0.5);
        $('#featured').parallax("50%", 0.5);
        $('#contact-details').parallax("50%", 0.5);
    },

    // Function to scroll with animation to desired element
    scrollTo: function(hash, offset, speed) {
        speed = (speed !== undefined ? speed : 2000);
        offset = (offset !== undefined ? offset : 0);
        var target_offset = $(hash).offset().top - offset;
        $('html, body').animate({
            scrollTop: target_offset
        }, speed);
    },

    // Function to control animatons events and classes
    animated_contents: function() {
        $(".animate:appeared").each(function(i) {
            var $this = $(this),
                animated = $(this).data('animate'),
                delay = 0,
                del = '';
            setTimeout(function(){
            if ($(this).data('delay')) {
                del = $(this).data('delay');
                if ($.isNumeric(del)) {
                    delay = $(this).data('delay');
                }
            }
            if (del == 'none') {
                setTimeout(function() {
                    $this.addClass('animated '+animated);
                }, 200);
                i = i + 1;
            } else {
                setTimeout(function() {
                    $this.addClass('animated '+animated);
                }, (150 * i) + delay);
            }
            $this.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass('animate').addClass('animateDone');
            });
            },400);
        });
    },

    blog: function() {
        $('.blog-more-posts').click(function() {
            var btn = $(this);
            var output = {};
            $.getJSON('http://' + window.location.host + '/spirito/110/php/posts.php',
                function(posts) {
                    for (var i = 0; i < posts.length; i++) {
                        post = '<div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"><article data-animate="flipInX" class="post animate fade-in-bottom"><a class="post-image" href="' + posts[i].link + '"><img alt="" src="' + posts[i].img + '"><div class="overlay"><i class="fa fa-' + posts[i].type + '"></i></div></a><h3 class="post-title"><a href="' + posts[i].link + '">' + posts[i].title + '</a></h3><p class="post-meta"><span class="meta-date">' + posts[i].date + '</span><span class="meta-by"><a href="#">' + posts[i].author + '</a></span></p><p class="post-content">' + posts[i].content + '</p><p class="post-read-more"><a class="btn btn-primary btn-sm" href="' + posts[i].link + '">Read More</a></p></article></div>';
                        output[i] = post;
                    }
                    $.each(output, function(i, value) {
                        setTimeout(function() {
                            $('.posts').append(value);
                            $(window).trigger('scroll');
                        }, (200 * i));
                    });
                    btn.animate({
                        'opacity': '0',
                        'height': '0'
                    }, function() {
                        btn.remove();
                    });
                }
            );
            return false;
        });
    },

    themeOptions: function() {
        $('.style-switcher .switcher-icon').on('click',function(){
            $(this).parent().toggleClass('active');
        });

        $('.style-switcher .colors li').on('click',function(){
            var color = $(this).attr('class');
            $('body').attr('data-color',color);

            Settings.set('color',color);
            Settings.save();
        });

        $('.style-switcher .head-color li > a').on('click',function(){
            var header = $(this).attr('data-header');
            $('nav#main').removeClass('dark colored');
            if(header === 'dark' || header === 'colored') $('nav#main').addClass(header);
            Settings.set('header',header);
            Settings.save();
        });
    }
}

var Settings = {
    s: {
        'color': 'red',
        'header': 'dark'
    },
    get: function(n) {
        return this.s[n] !== undefined ? this.s[n] : null;
    },
    set: function(n,v) {
        this.s[n] = v;
        return this;
    },
    load: function() {
        var s = localStorage.getItem('Spirito');
        if(s !== null) this.s = JSON.parse(s);
        return this;
    },
    save: function() {
        localStorage.setItem('Spirito',JSON.stringify(this.s));
        return this;
    }
}