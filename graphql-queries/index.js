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
        popularityFilter: `
          {
            Page (page: 1, perPage: 10) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (type: ANIME, sort:POPULARITY_DESC) {
                id
                popularity
                coverImage {
                  large
                  extraLarge
                }
                bannerImage
                title {
                  romaji
                  native
                  english
                }
                
                description
                averageScore
                
                genres  
              }
            }
          }
        `,

        trendingFilter: `
          {
            Page (page: 2, perPage: 6) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (type: ANIME, sort: TRENDING_DESC) {
                id
                season
                seasonYear
                trending
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
    },

    animePage: `
      query animePage ($id: Int) { # Define which variables will be used in the query (id)
        Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
          id
          
          coverImage {
            large
          }
          
          bannerImage 
          
          title {
            romaji
            english
            native
          }

          recommendations {
            edges {
              node {
                id
                mediaRecommendation {
                  id
                  title {
                    userPreferred
                    romaji
                    english
                    native
                  }
                  coverImage {
                    extraLarge
                    large
                    medium
                  }
                }
              }
            }
          }

          reviews (page: 1, perPage: 10, sort: RATING_DESC) {
            edges {
              node {
                id
                mediaId
                createdAt
                summary
                rating
                ratingAmount
                score
                user {
                  id
                  name
                  avatar {
                    large
                    medium
                  }
                }
                body
              }
            }
          }
          
          characters(sort: ROLE) {
            edges {
              id
              
              node {
                name {
                  first
                  middle
                  last
                  full
                  native
                  userPreferred
                }
                gender
                image {
                  large
                  medium
                }
              }
              
            }
          }

          genres
          
          description(asHtml: false)
        }
      }
    `,
    general: {
      review: `
        query review ($id: Int){
          Review (id: $id) {
            createdAt
            summary
            rating
            ratingAmount
            score
            user {
              id
              name
              avatar {
                large
                medium
              }
            }
            body (asHtml: true)
            siteUrl
          }
        }
      `,
      allGenreTags: `{
        GenreCollection
      }
      `,
      search: `
         query search ($search: String) {
          Page (page: 1, perPage: 20) {
            pageInfo {
              total
              currentPage
              lastPage
              hasNextPage
              perPage
            }
            media (type: ANIME, search: $search, isAdult: false) {
              id
              season
              title {
                romaji
                english
                native
                userPreferred
              }
              
              coverImage {
                extraLarge
                large
                medium
                color
              }


            
              
              
            }
          }
        
        }
      `
    }
}

module.exports = queries;
