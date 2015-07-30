Github Battle
=============

This simple web-app allow you to challenge 2 Github users. The app compute the 
score for each user, the one with the highest score wins. Theoretically, the 
score should (I said "should" because the formula for the score is quite simple)
 represent how much the user is active on GitHub. The idea came out looking 
GitHub Awards so for who doesn't know it please check that site.
Anyway if you want to try it go to [**GitHub Battle**](http://github-battle.com).


How it is computed the score
----------------------------
The total score is the sum of all repo's scores. Each of them is computed as 
following:

    repo_score = stars + 1.5*forks + 0.2*watchers 

As you can see the formula is quite simple and it does not get in account the 
contribution to external repos such as pull request and ect.
Sometimes may appear an item called N/A in the different languages component;
this is happens because fro some repository GitHub can not understand which 
language is used (i.e. when a repository is composed of many different languages
) and it put 'null' as value. So to not have the string 'null' I've used 'N/A'.

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
