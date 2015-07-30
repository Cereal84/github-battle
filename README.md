Github Battle
=============

This simple web-app allow you to challenge 2 Github users. The app compute the 
score for each user, the one with the highest score wins. Theoretically, the 
score should (I said "should" because the formula for the score is quite simple)
 represent how much the user is active on GitHub. The idea came out looking 
GitHub Awards so for who doesn't know it please check that site.


How it is computed the score
----------------------------
The total score is the sum of all repo's scores. Each of them is computed as 
following:

    repo_score = stars + 1.5*forks + 0.2*watchers 

As you can see the formula is quite simple and it does not get in account the 
contribution to external repos such as pull request and ect.

Data
----

The data are retrieved on the fly doing some ajax request to the API of GitHub.
Nothing is stored.

Author
------

Alessandro Pischedda

Contact
-------
alessandro.pischedda@gmail.com


Credits
---------

This site makes use of Freelance, an open source Bootstrap theme created by 
[**Start Bootstrap**](http://startbootstrap.com).

[**GitHub Awards**](http://github-awards.com).
