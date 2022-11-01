const queries = {
    // * These queries are for the home page
    animeCards: {

        // Season Sort
        seasonFilter: `
        {
            Page (page: 2, perPage: 6) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (type: ANIME, season: FALL, seasonYear: 2022) {
                id
                season
                seasonYear
                coverImage {
                    large
                }
                title {
                  romaji
                  native
                  english
                }
                
              }
            }
          
          }
        `,




    }
}

module.exports = queries;
