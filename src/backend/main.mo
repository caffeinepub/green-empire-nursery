import List "mo:core/List";
import Time "mo:core/Time";

actor {
  type Review = {
    name : Text;
    location : Text;
    text : Text;
    rating : Nat;
    timestamp : Int;
  };

  func getSeedReviews() : List.List<Review> {
    let seedReviews = List.empty<Review>();
    seedReviews.add({
      name = "Priya S.";
      location = "Chennai";
      text = "Beautiful plants, great quality! My home looks so much more vibrant now. The money plant I ordered is growing beautifully.";
      rating = 5;
      timestamp = Time.now();
    });
    seedReviews.add({
      name = "Karthik M.";
      location = "Tamil Nadu";
      text = "My terrarium is absolutely stunning. The customization was perfect and it arrived safely packed. Highly recommend!";
      rating = 5;
      timestamp = Time.now();
    });
    seedReviews.add({
      name = "Anjali R.";
      location = "Coimbatore";
      text = "Very affordable and fast delivery! Ordered 3 plants and they all arrived healthy. Will definitely order again.";
      rating = 5;
      timestamp = Time.now();
    });
    seedReviews;
  };

  let reviews = getSeedReviews();

  // Returns all reviews, newest first
  public query func getReviews() : async [Review] {
    reviews.reverse().toArray();
  };

  // Submit a new review
  public shared ({ caller }) func submitReview(name : Text, location : Text, text : Text, rating : Nat) : async Bool {
    if (rating < 1 or rating > 5) {
      return false;
    };
    let review : Review = {
      name;
      location;
      text;
      rating;
      timestamp = Time.now();
    };
    reviews.add(review);
    true;
  };
};
