var utils = require('../../../lib/utils');

module.exports = {

    provides: 'tableau_image',

    getMeta: function (tableau) {

        return {
            title: tableau.title,
            description: tableau.description,
            views: tableau.views,
            author: tableau.author,
            date: tableau.date,
            site: 'Tableau Software' // from og.site_name
        }
    },

    getData: function(tableau, options, cb) {

            var firstImage = 'http://public.tableau.com/static/images/' + tableau.workbook.substring(0,2) + '/' + tableau.workbook + '/' + tableau.view + '/1.png';

            utils.getImageMetadata(firstImage, options, function(error, data) {

                var image = null;

                if (error || data.error) {

                    console.log ('Error getting first image for Tableau: ' + (error || data.error));

                } else if (data.width && data.height) {

                    image = {tableau_image: {
                        href: firstImage,
                        type: CONFIG.T.image, 
                        rel: CONFIG.R.image,
                        width: data.width,
                        height: data.height
                    }};
                }

                cb(null, image);                

            });
    },

    getLinks: function(tableau, tableau_image, options) {

        if (tableau_image.width && tableau_image.height) {

            var links = [{
                href: '//public.tableau.com/thumb/views/' + tableau.workbook + '/' + tableau.view,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: 736,
                height: 454 // it's always the same
            }];

            var app = {
                href: '//public.tableau.com/views/' + tableau.workbook + '/' + tableau.view + '?:showVizHome=no&:embed=true',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.ssl, CONFIG.R.html5],
                'aspect-ratio': tableau_image.width / (tableau_image.height > 60 ? tableau_image.height - 60 : tableau_image.height ),
                'padding-bottom': 60,
                'max-width': tableau_image.width + 20
            };

            if (tableau.showTabs) {
                app['padding-bottom'] = 25;
            } else {
                app.href += '&:tabs=no';
            }

            links.push(app);

            links.push(tableau_image);

            links.push({
                href: 'https://public.tableau.com/favicon.ico',
                type: CONFIG.T.image,
                rel: CONFIG.R.icon
            });

            return links;
        }
    },

    tests: [
        "http://public.tableau.com/views/williamsburghSubstitue_v2/L_pocalyse",
        "http://public.tableau.com/views/williamsburghSubstitue_v2/L_pocalyse?:embed=y&:showVizHome=no&:display_count=y&:display_static_image=y&:bootstrapWhenNotified=true",
        "https://public.tableau.com/profile/callie3559#!/vizhome/Philly2/Sheet2",
        //tabs:
        "https://public.tableau.com/views/Metro-levelDataVizoftheWeek/UrbanCorePerformance?:embed=y&:display_count=yes&:showTabs=y",
        "http://public.tableau.com/shared/7P2SM3PQG?:display_count=no",
        // not responsive:
        "http://public.tableau.com/shared/X7RMWXZYQ?:display_count=yes",
        "https://public.tableau.com/profile/will.gates#!/vizhome/OleMissvs_AlabamaWeek32016/Story1",
        "https://public.tableau.com/shared/7SRD23PNF?:embed=y&:showVizHome=no&:display_static_image=y&:bootstrapWhenNotified=true",
        "https://public.tableau.com/shared/NHR6XWHDQ?:display_count=yes"
    ]
};