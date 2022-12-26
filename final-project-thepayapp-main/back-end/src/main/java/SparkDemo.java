import static com.mongodb.client.model.Filters.in;
import static spark.Spark.*;
import com.google.gson.Gson;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import static com.mongodb.client.model.Filters.eq;
import com.mongodb.client.model.Filters;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

// This class will hold a number (in string type) for any amount in transit.

class IncomingTransactionData {
  String to;
  String from;
  String notes;
  String paymentType;
  String amount;
}

class OutgoingTransactionData {
  String to;
  String from;
  String notes;
  String paymentType;
  String amount;
  String error;

  public OutgoingTransactionData(String to, String from, String notes, String paymentType, String amount, String error) {
    this.to = to;
    this.from = from;
    this.notes = notes;
    this.paymentType = paymentType;
    this.amount = amount;
    this.error = error;
  }
}

// The purpose of this class is to hold data sent from the front end.
class IncomingUserData {
  String firstname;
  String lastname;
  String username;
  String password;
  String bio;
  String bankName;
}

// This will return data to the front end.
class OutgoingUserData {
  Boolean isLoggedIn;
  String error;
  String firstname;
  String lastname;
  String username;
  String password;
  String bio;
  String bankName;
  String balance;
  String myTransactions; // This will just be a parse-able string that stores entire transactions record.

  public OutgoingUserData(Boolean isLoggedIn, String error,
                          String firstname, String lastname,
                          String username, String password,
                          String bio, String bankName,
                          String balance, String myTransactions) {
    this.isLoggedIn = isLoggedIn;
    this.error = error;
    this.firstname = firstname;
    this.lastname = lastname;
    this.username = username;
    this.password = password;
    this.bio = bio;
    this.bankName = bankName;
    this.balance = balance;
    this.myTransactions = myTransactions;
  }
}

public class SparkDemo {

  // This will be used to query info from currently logged-in user.
  static public String saved_username;

  public static void main(String[] args) {

    port(1234);

    // open connection
    MongoClient mongoClient = new MongoClient("localhost", 27017);
    MongoDatabase db = mongoClient.getDatabase("database");

//    These are our only two collections.
    MongoCollection<Document> users = db.getCollection("users");
    MongoCollection<Document> transactions = db.getCollection("transactions");
    Gson gson = new Gson();









    post("/new", (req, res) -> {
      System.out.println("New User post");
      String body = req.body();
      IncomingUserData incomingUserData = gson.fromJson(body, IncomingUserData.class);
      Document existingUser = users.find(eq("username", incomingUserData.username)).first();
      if (existingUser != null) {
        return gson.toJson(new OutgoingUserData(false, "User Already Exists", null,
                null, null, null, null, null, null, null));
      }
      else if((incomingUserData.username.equals(""))||(incomingUserData.password.equals(""))||(incomingUserData.bio.equals(""))||(incomingUserData.firstname.equals(""))||(incomingUserData.lastname.equals(""))){
        System.out.println("Empty stuff ");
        if(incomingUserData.username.equals("")){
          return gson.toJson(new OutgoingUserData(false, "Error Username Left Blank", null,
                  null, null, null, null, null, null, null));

        }else if(incomingUserData.password.equals("")){
          return gson.toJson(new OutgoingUserData(false, "Error Password Field Left Blank", null,
                  null, null, null, null, null, null, null));

        }else if(incomingUserData.bio.equals("")){
        return gson.toJson(new OutgoingUserData(false, "Error Bio Field Left Blank", null,
                null, null, null, null, null, null, null));

      }else if(incomingUserData.firstname.equals("")){
        return gson.toJson(new OutgoingUserData(false, "Error First Name Field Left Blank", null,
                null, null, null, null, null, null, null));

      }else if(incomingUserData.lastname.equals("")){
        return gson.toJson(new OutgoingUserData(false, "Error Last Name Field Left Blank", null,
                null, null, null, null, null, null, null));

      }
        return gson.toJson(new OutgoingUserData(false, "Don't Leave Blank Fields", null,
                null, null, null, null, null, null, null));
      }
      else if((incomingUserData.username.length()<5)||(incomingUserData.password.length()<12)){
        if(incomingUserData.username.length()<5){
          return gson.toJson(new OutgoingUserData(false, "Username too short. Must be 5 characters long.", null,
                  null, null, null, null, null, null, null));

        } else if(incomingUserData.password.length()<12){
          return gson.toJson(new OutgoingUserData(false, "Password too short. Must be 12 characters long.", null,
                  null, null, null, null, null, null, null));

        }
        System.out.println("length of username "+incomingUserData.username.length()+"Length of password "+incomingUserData.password.length());

        return gson.toJson(new OutgoingUserData(false, "Don't Leave Blank Fields", null,
                null, null, null, null, null, null, null));
      }
      else{
        //initializing data for a new user here
        Document document = new Document("username", incomingUserData.username)
                .append("password", incomingUserData.password)
                .append("firstname", incomingUserData.firstname)
                .append("lastname", incomingUserData.lastname)
                .append("bio", incomingUserData.bio)
                .append("balance", "0")
                .append("myTransactions", "");

        saved_username = incomingUserData.username;

        users.insertOne(document);
        return gson.toJson(new OutgoingUserData(true, null, null, null, null,
                null, null, null, "0", null));
      }
    });







//    login will search for an existing user and return valid or invalid to the front end
    post("/logIn", (req, res) -> {
      String body = req.body();
      IncomingUserData incomingUserData = gson.fromJson(body, IncomingUserData.class);
      Document existingUser = users.find(eq("username", incomingUserData.username)).first();
       if (incomingUserData.username.length()<2){

         return gson.toJson(new OutgoingUserData(false, "Error Username field is blank ", null, null, null,
                 null, null, null, "0", null));

       }if (incomingUserData.password.length()<2){

        return gson.toJson(new OutgoingUserData(false, "Error Password field is blank ", null, null, null,
                null, null, null, "0", null));

      }
      if (existingUser != null) {
        if (existingUser.getString("password").equals(incomingUserData.password)) {

          // username is saved for the purpose of easily querying user data on the front end
          saved_username = incomingUserData.username;
          return gson.toJson(new OutgoingUserData(true, null, existingUser.getString("firstname"), existingUser.getString("lastname"),
                  existingUser.getString("username"), null, null, null, existingUser.getString("balance"), existingUser.getString("myTransactions")));
        }
        else {
          System.out.println("Invalid password");
          return gson.toJson(new OutgoingUserData(false, "Invalid password", null,
                  null, null, null, null, null, null, null));
        }
      }
//        only information that needs to be returned is log in status and error status.
      System.out.println("No user Found");
      return gson.toJson(new OutgoingUserData(false, "No User Found", null, null, null,
              null, null, null, "0", null));
    });










//    The purpose of this method is to find a valid user on the platform, before returning there basic information to the caller.
    post("/findUser", (req, res) -> {
      String body = req.body();
      IncomingUserData incomingUserData = gson.fromJson(body, IncomingUserData.class);
      Document existingUser = users.find(eq("username", incomingUserData.username)).first();

//      if this is user exists, then we will return their basic information
      if (existingUser != null) {

        return gson.toJson(new OutgoingUserData(true, null,
                existingUser.getString("firstname"),
                existingUser.getString("lastname"),
                null,
                null,
                existingUser.getString("bio"),
                null,
                "0",
                null));
      }

//      default return value will send error warning to front end
      return gson.toJson(new OutgoingUserData(false, "user not found",
              null, null, null, null, null,
              null, null, null));
    });








//    This method will get all the information of the user that is currently logged in.
    post("/getMyInfo", (req, res) -> {
      Document existingUser = users.find(eq("username", saved_username)).first();

      if (existingUser != null) {
        return gson.toJson(new OutgoingUserData(true, null,
                existingUser.getString("firstname"),
                existingUser.getString("lastname"),
                existingUser.getString("username"),
                existingUser.getString("password"),
                existingUser.getString("bio"),
                existingUser.getString("bankName"),
                existingUser.getString("balance"),
                existingUser.getString("myTransactions")));
      }
      return gson.toJson(new OutgoingUserData(null, "error", null, null,
                null, null, null, null,null, null));
    });








// This method will update the balance of the current user logged in
    post("/updateBalance", (req, res) -> {
      String body = req.body();
      IncomingTransactionData incomingTransactionData = gson.fromJson(body, IncomingTransactionData.class);
      Document existingUser = users.find(eq("username", saved_username)).first();

      boolean containsDecimal = false;
      int positionAfterDecimal = 0;

      if (!incomingTransactionData.amount.isBlank()) {

        for (int i = 0; i < incomingTransactionData.amount.length(); i++) {

          if (incomingTransactionData.amount.charAt(i) < '0' ||
                  incomingTransactionData.amount.charAt(i) > '9') {

            if (incomingTransactionData.amount.charAt(i) == '.' && !containsDecimal) {
              containsDecimal = true;
            }
            else {
              return gson.toJson(new OutgoingTransactionData(null, null, null,
                      null, null, "Invalid amount given."
              ));
            }
          }
          else if (containsDecimal) {
            positionAfterDecimal++;
            if (positionAfterDecimal > 2) {
              return gson.toJson(new OutgoingTransactionData(null, null, null,
                      null, null, "Invalid amount given."
              ));
            }
          }
        }
      }

//     This converts the strings to doubles, and then adds the values
      assert existingUser != null;
      double balance = Double.parseDouble(existingUser.getString("balance"));
      double c_transfer = Double.parseDouble(incomingTransactionData.amount);
      double new_balance = balance + c_transfer;

//      This converts the sum back to string, before updating the users balance.
      String c_new_balance = String.valueOf(new_balance);
      users.updateOne(Filters.eq("username", saved_username), Updates.set("balance", c_new_balance));

      return gson.toJson(new OutgoingTransactionData(null, null, null,
              null, null, null
      ));
    });








//    This method will update the general account information of the current user logged in.
    post("/updateAccount", (req, res) -> {
      String body = req.body();
      IncomingUserData incomingUserData = gson.fromJson(body, IncomingUserData.class);
      Document existingUser = users.find(eq("username", saved_username)).first();
      assert existingUser != null;

//      cannot change username since we need that to id transactions. Ideally we would use an id number.
//      There is probably a better way to do this ...
      if (!incomingUserData.firstname.isBlank())
        users.updateOne(Filters.eq("username", saved_username), Updates.set("firstname", incomingUserData.firstname));
      if (!incomingUserData.lastname.isBlank())
        users.updateOne(Filters.eq("username", saved_username), Updates.set("lastname", incomingUserData.lastname));
      if (!incomingUserData.password.isBlank())
        users.updateOne(Filters.eq("username", saved_username), Updates.set("password", incomingUserData.password));
      if (!incomingUserData.bio.isBlank())
        users.updateOne(Filters.eq("username", saved_username), Updates.set("bio", incomingUserData.bio));
      if (!incomingUserData.bankName.isBlank())
        users.updateOne(Filters.eq("username", saved_username), Updates.set("bankName", incomingUserData.bankName));

      return null;
    });






    post("/makeTransaction", (req, res) -> {
      String body = req.body();
      IncomingTransactionData incomingTransactionData = gson.fromJson(body, IncomingTransactionData.class);
      Document existingUser = users.find(eq("username", incomingTransactionData.to)).first();

//      check that amount is a nonempty number
//       There is probably a better way to check decimal places
      boolean containsDecimal = false;
      int positionAfterDecimal = 0;

      if (!incomingTransactionData.amount.isBlank()) {

        for (int i = 0; i < incomingTransactionData.amount.length(); i++) {

          if (incomingTransactionData.amount.charAt(i) < '0' ||
          incomingTransactionData.amount.charAt(i) > '9') {

            if (incomingTransactionData.amount.charAt(i) == '.' && !containsDecimal) {
              containsDecimal = true;
            }
            else {
              return gson.toJson(new OutgoingTransactionData(null, null, null,
                      null, null, "Invalid amount given."
              ));
            }
          }
          else if (containsDecimal) {
            positionAfterDecimal++;
            if (positionAfterDecimal > 2) {
              return gson.toJson(new OutgoingTransactionData(null, null, null,
                      null, null, "Invalid amount given."
              ));
            }
          }
        }
      }

      double c_transfer = Double.parseDouble(incomingTransactionData.amount);

//      if we are sending payments to a real user, then we will proceed with the transaction
      if (existingUser != null)  {

        //      check that user isn't sending money to themselves
        if (Objects.equals(saved_username, incomingTransactionData.to)) {
          return gson.toJson(new OutgoingTransactionData(null, null, null,
                  null, null, "Cannot send money to yourself."
          ));
        }
        System.out.println(incomingTransactionData.amount);
        Document document = new Document("from", saved_username)
                .append("to", incomingTransactionData.to)
                .append("from", saved_username)
                .append("paymentType", incomingTransactionData.paymentType)
                .append("notes", incomingTransactionData.notes)
                .append("amount", incomingTransactionData.amount);

        transactions.insertOne(document);

//        from here we will update the accounts on both ends of the transaction
//        first we will update the user currently logged in
        Document sender = users.find(eq("username", saved_username)).first();

        // inserting transaction into senders list
        assert sender != null;
        double balance = Double.parseDouble(sender.getString("balance"));
        double new_balance = balance - c_transfer;

//        This is converting the new sum back to String. Users cannot user "|\" characters
        String c_new_balance = String.valueOf(new_balance);
        String receipt = "";

//        initialize myTransaction here
        if (sender.getString("myTransactions").isEmpty()) {
          receipt = "|/|" +
                  incomingTransactionData.to + "|" +
                  saved_username + "|" +
                  incomingTransactionData.notes + "|" +
                  incomingTransactionData.amount + "|" +
                  c_new_balance + "|/|";
        } else {
          receipt = sender.getString("myTransactions") +
                  incomingTransactionData.to + "|" +
                  saved_username + "|" +
                  incomingTransactionData.notes + "|" +
                  incomingTransactionData.amount + "|" +
                  c_new_balance + "|/|";
        }



        System.out.println(receipt);
        users.updateOne(Filters.eq("username", saved_username), Updates.set("balance", c_new_balance));
        users.updateOne(Filters.eq("username", saved_username), Updates.set("myTransactions", receipt));

//        next we will update the balance of the receiver
        Document receiver = users.find(eq("username", incomingTransactionData.to)).first();

        assert receiver != null;
        balance = Double.parseDouble(receiver.getString("balance"));
        new_balance = balance + c_transfer;

        //      This converts the sum back to string, before updating the users balance.
        c_new_balance = String.valueOf(new_balance);

        if (receiver.getString("myTransactions").isEmpty()) {
          receipt = "|/|" +
                  incomingTransactionData.to + "|" +
                  saved_username + "|" +
                  incomingTransactionData.notes + "|" +
                  incomingTransactionData.amount + "|" +
                  c_new_balance + "|/|";
        } else {
          receipt = receiver.getString("myTransactions") +
                  incomingTransactionData.to + "|" +
                  saved_username + "|" +
                  incomingTransactionData.notes + "|" +
                  incomingTransactionData.amount + "|" +
                  c_new_balance + "|/|";
        }



        users.updateOne(Filters.eq("username", incomingTransactionData.to), Updates.set("balance", c_new_balance));
        users.updateOne(Filters.eq("username", incomingTransactionData.to), Updates.set("myTransactions", receipt));

        return gson.toJson(new OutgoingTransactionData(null, null, null,
                null, null, null
        ));
      }

//      the default return will be an error message that user in 'to' field doesn't exist
      return gson.toJson(new OutgoingTransactionData(null, null, null,
              null, null, "user not found."
      ));
    });

  }
}