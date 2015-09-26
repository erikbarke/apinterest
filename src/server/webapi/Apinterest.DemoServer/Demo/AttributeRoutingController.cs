using System;
using System.Collections.Generic;
using System.Web.Http;

namespace Apinterest.DemoServer.Demo
{
    [Authorize]
    [RoutePrefix("api/AttributeRouting")]
    public class AttributeRoutingController : ApiController
    {
        /*
        [HttpGet]
        [Route("movies/{id}")]
        public Movie Get(
            decimal id,
            [FromUri] Lobby lobby,
            [FromUri] int[] seats,
            [FromUri] IEnumerable<string> customers,
            [FromUri] IDictionary<int, string> keyStore,
            [FromBody] Theater theater,
            bool hasLobby,
            char rating,
            DateTime movieDate,
            TimeSpan movieLength)
        {
            return CreateMovie();
        }*/

        [HttpGet]
        [AllowAnonymous]
        [Route("movies/{id}")]
        public Movie Get(
            decimal id,
            [FromUri] Lobby lobby,
            [FromUri] int[] seats,
            [FromUri] IEnumerable<string> customers,
            [FromUri] IDictionary<int, string> keyStore,
            [FromBody] Theater theater,
            bool hasLobby,
            char rating,
            DateTime movieDate,
            TimeSpan movieLength)
        {
            return CreateMovie();
        }

        private static Movie CreateMovie()
        {
            return new Movie
            {
                Id = 12345,
                Type = MovieType.SciFi,
                MovieGoers = new Dictionary<string, MovieGoer>
                {
                    {
                        "Person 1", new MovieGoer
                        {
                            MovieType = MovieType.TwoCops,
                            Soda = true,
                            Popcorn = false,
                            Favorites = new Dictionary<string, Comment>
                            {
                                {
                                    "Big car chase movie", new Comment {Text = "Awesome, dude. Crashes and stuff."}
                                }
                            }
                        }
                    },
                    {
                        "Person 2", new MovieGoer
                        {
                            MovieType = MovieType.ChickFlick,
                            Soda = false,
                            Popcorn = true,
                            Favorites = new Dictionary<string, Comment>
                            {
                                {
                                    "Tearful goodbye", new Comment {Text = "Lik Dis If U Cry Evertim"}
                                },
                                {
                                    "Popular boy meets girl with glasses", new Comment {Text = "That was sooo meee"}
                                }
                            }
                        }
                    }
                }
            };
        }

        [HttpGet]
        [Route("movies/lobby/{id}")]
        public sbyte GetLobby(int id, [FromUri] Lobby lobby)
        {
            return -123;
        }

        [HttpGet]
        [Route("movies/really/big/document/which/might/hang/the/browser")]
        public IEnumerable<Movie> GetReallyBigDocument()
        {
            var movies = new List<Movie>();

            for (var i = 0; i < 100; i++)
            {
                movies.Add(CreateMovie());
            }

            return movies;
        }
    }

    public class Theater
    {
        public decimal TheaterId { get; set; }
        public MovieGoer MovieGoer { get; set; }
        public IDictionary<string, string> KeysAndValues { get; set; }
        public IDictionary<string, MovieGoer> KeysAndObjectValues { get; set; }
        public IEnumerable<MovieGoer> ListOfObjects { get; set; }
        public IEnumerable<int> ListOfNumbers { get; set; }
        public IEnumerable<bool> ListOfBooleans { get; set; }
        public IEnumerable<string> ListOfStrings { get; set; }
    }

    public enum MovieType
    {
        Comedy,
        RoadMovie,
        ChickFlick,
        Bollywood,
        Horror,
        BuddyMovie,
        TwoCops,
        SciFi
    }

    public struct MovieGoer
    {
        public MovieType MovieType { get; set; }
        public bool Popcorn { get; set; }
        public bool Soda { get; set; }
        public IDictionary<string, Comment> Favorites { get; set; }
    }

    public class Lobby
    {
        public string Location;
        public bool PopcornVendingMachine;
    }

    public class Comment
    {
        public string Text { get; set; }
    }

    public class Movie
    {
        public int? Id { get; set; }
        public MovieType? Type { get; set; }
        public IDictionary<string, MovieGoer> MovieGoers { get; set; }
    }
}