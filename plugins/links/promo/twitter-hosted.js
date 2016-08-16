module.exports = {

    provides: '__promoUri',    

    getData: function(url, twitter, whitelistRecord) {
        
        // do not process if there is a whitelist record for this domain as processing will take longer
        if (!whitelistRecord.isDefault && whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.player')) {return;}

        var video_src = (twitter.player && twitter.player.value) || twitter.player;
        if (!video_src || typeof video_src !== "string" || /youtube\.com|vimeo\.com|dailymotion\.com|theplatform\.com|jwplatform\.com/.test(url)) {
            return;
        }

        var urlMatch = video_src.match(/https?:\/\/www\.youtube\.com\/v\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/www\.youtube-nocookie\.com\/v\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/www\.youtube-nocookie\.com\/embed\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/www\.youtube\.com\/embed\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/youtube\.googleapis\.com\/v\/([\-_a-zA-Z0-9]+)/i) //youtube.googleapis.com/v/k3Cd2lvQlN4?rel=0
                    || video_src.match(/https?:\/\/www.youtube\.com\/watch\?v=([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/youtu\.be\/([\-_a-zA-Z0-9]+)/i);


        // Allow YouTube
        if (urlMatch) {
            return {
                __promoUri: "https://www.youtube.com/watch?v=" + urlMatch[1]
            };
        } 

        urlMatch = video_src.match(/^https?:\/\/vimeo\.com\/(\d+)/i)
                    || video_src.match(/^https?:\/\/player.vimeo\.com\/video\/(\d+)/i)
                    || video_src.match(/https?:\/\/vimeo\.com\/moogaloop\.swf\?clip_id=(\d+)/i);


        // Or Vimeo
        if (urlMatch) {
            return {
                __promoUri: "https://vimeo.com/" + urlMatch[1]
            };
        } 


        // or DailyMotion, e.g. Liberation, Le Point, L'Express
        urlMatch = video_src.match(/^https?:\/\/www\.dailymotion\.com\/(?:swf|embed)?\/?video\/([_a-zA-Z0-9\-]+)/i)
                    || video_src.match(/^https?:\/\/dai.ly\/([_a-zA-Z0-9\-]+)/i); // e.g. Libération.fr

        if (urlMatch) {
            return {
                __promoUri: "http://www.dailymotion.com/video/" + urlMatch[1]
            };
        } 


        // or theplatform
        urlMatch = video_src.match(/^https?:\/\/player\.theplatform\.com\/p\/[_a-zA-Z0-9\-]+\/select\/[_a-zA-Z0-9\-]+/i)
                    || video_src.match(/^https?:\/\/player\.theplatform\.com\/p\/[_a-zA-Z0-9\-\/]+\/select\/[_a-zA-Z0-9\-]+/i);

        if (urlMatch) {
            return {
                __promoUri: {
                    url: video_src  + '?for=iframely', // otherwise player=canonical,
                    rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                }
            };
        }


        // or jwplatform
        urlMatch = video_src.match(/^https?:\/\/content\.jwplatform\.com\/players\/[_a-zA-Z0-9\-]+\.html/i);

        if (urlMatch) {
            return {
                __promoUri: {
                    url: video_src  + '?for=iframely', // otherwise player=canonical,
                    rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                }
            };
        } 


    }

};