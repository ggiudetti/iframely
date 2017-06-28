module.exports = {
    re: [
        /^https?:\/\/(www|m)\.facebook\.com\/(?:pg\/)?([a-zA-Z0-9\.\-]+)\/?(?:about|photos|videos|events)?\/?(?:\?p?n?f?ref=\w+)?$/i
    ],

    getMeta: function(oembed, meta, urlMatch) {

        if (meta.og && meta.og.title) {
            return {
                title: meta.og.title,
                description: meta.og.description
            }
        } else if (oembed.html) {

            var title = oembed.html.match(/>([^<>]+)<\/a><\/blockquote>/i);
            title = title ? title[1] : urlMatch[2];

            return {
                title: title
            };
        }
    },    

    getLinks: function(oembed, meta, url, options) {

        var links = [];

        if (meta.og && meta.og.image) {
            links.push ({
                href: meta.og.image,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            });
        }
        // skip user profiles - they can not be embedded
        if (meta.al && meta.al.android && meta.al.android.url && !/\/profile\//.test(meta.al.android.url) && /blockquote/.test(oembed.html)) {

            var html = oembed.html;

            if (/^https?:\/\/(?:www|m)\.facebook\.com\/(?:pg\/)?[a-zA-Z0-9\.\-]+\/?(events)\/?(?:\?f?ref=\w+)?$/i.test(url)) {

                html = html.replace(/data\-show\-posts=\"(?:true|1|0)?\"/i, 'data-show-posts="0" data-tabs="' + url.match(/^https?:\/\/(?:www|m)\.facebook\.com\/(?:pg\/)?[a-zA-Z0-9\.\-]+\/?(events)\/?(?:\?f?ref=\w+)?$/i)[1]+ '"');
            }

            if (options.getProviderOptions(CONFIG.O.full, false)) {

                html = html.replace(/data\-show\-posts=\"(?:false|0)?\"/i, 'data-show-posts="1"');
                html = html.replace(/data\-show\-facepile=\"(?:false|0)?\"/i, 'data-show-facepile="1"');

            } else if (options.getProviderOptions(CONFIG.O.compact, false)) {

                html = html.replace(/data\-show\-posts=\"(?:true|1)?\"/i, 'data-show-posts="0"');
                html = html.replace(/data\-show\-facepile=\"(?:true|1)?\"/i, 'data-show-facepile="0"');
                
            }

            links.push ({
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5, CONFIG.R.inline],
                html: html,
                "max-width": oembed.width
            });
        }

        return links;
    },

    tests: [
        "https://www.facebook.com/hlaskyjanalasaka?fref=nf",
        "https://www.facebook.com/pg/RhulFencing/about/",
        {
            noFeeds: true
        }
    ]
};