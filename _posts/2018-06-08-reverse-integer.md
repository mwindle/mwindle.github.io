---
layout: post
title: "Reverse Integer: Playing with the limits of a 32-bit signed int"
categories:
---

## Problem
Given a 32-bit signed integer *x*, return a new integer with the digits of *x* reversed. The given integer can be anything in the entire [-2<sup>31</sup>, 2<sup>31</sup> - 1] range.[^1]

Return **0** if the reversed integer would overflow the bounds of a 32-bit signed integer. Assume we are dealing with an environment which can only store integers within the 32-bit signed integer range, so **do not** use a *long* type.

#### Examples:
##### Example 1 #####
```
Input: 321
Output: 123
```
##### Example 2 #####
```
Input: -123
Output: -321
```
##### Example 3 #####
```
Input: 120
Output: 21
```

## Solution
Let's look at one of the examples and try to reverse the digits of the number *321*. The end result we're looking for is **123**, but how can we get there? Have a look at the end result more closely.
```
123 = 100 + 20 + 3
123 = 1*10² + 2*10¹ + 3*10⁰
```
Notice that when written as powers of ten, the digits of ```x``` and the desired return value are now isolated. How can we use this to our advantage?

Notice that we can produce the leftmost digit of our desired result with the following statement.
```
x mod 10 = 321 mod 10 = 1
```
Let's save that in a variable called ```result```. With that saved, we can truncate that digit from ```x```. We can do this by dividing itself by **10**.
```
x = x / 10 = 321 / 10 = 32.1 casted to int equals 32
```
Now ```result = 1``` and ```x = 32```. Since there are still some digits left to copy from *x*, let's repeat these steps again. We need to make one adjustment though. Because the existing *1* digit in *result* needs to shift left one place before we append the next digit, we'll multiply result by *10* first.  
```
result = result * 10 + x mod 10
result = 1 * 10 + 32 mod 10
result = 10 + 2 = 12
x = x / 10 = 32 / 10 = 3.2 casted to int equals 3
```
Repeating these steps one more time will copy the final *3* digit, producing our desired end result of *123*. We know we're done when there are no more digits to copy from *x*. This happens when ```x = 0```.

The final consideration we have is to return **0** when the reversal of x would exceed the bounds of a 32-bit signed integer. On top of that, we need to implement that behavior without the use of a larger integer type such as *long*. How can we do this?

The step in our current logic that would cause the result to overflow is the following.
```
result = result * 10 + x mod 10
```
Before we execute that statement, we need to make sure it would not cause result to overflow. Specifically, we need to ensure both of the following equations are false.
```
result * 10 + x mod 10 > 2³¹ - 1
result * 10 + x mod 10 < -2³¹
```
Checking those conditions above directly could result in an integer overflow. We need to find a way to confirm those statements without an overflow. How can we do that? Well, rather than *increasing* result to check the condition, we can *decrease* the other side of the equation.
```
let digit = x mod 10
result * 10 + digit > 2³¹ - 1
result * 10 > 2³¹ - 1 - digit
result > (2³¹ - 1 - digit) / 10
```
There is one case where the above could overflow, and that's when ```digit < 0```. We should only check the upper bound when ```digit >= 0```.

We can use the same logic above to check the lower bound for cases where ```digit < 0```.

Bringing that all together, here's what the final solution looks like.

#### Java
{% highlight java %}
public int reverse(int x) {
    int reversed = 0, digit = 0;
    while (x != 0) {
        digit = x % 10;
        if ((digit >= 0 && reversed > (Integer.MAX_VALUE - digit) / 10) ||
            (digit < 0 && reversed < (Integer.MIN_VALUE - digit) / 10)) {
            return 0;
        }
        reversed = reversed * 10 + digit;
        x /= 10;
    }
    return reversed;
}
{% endhighlight %}

+ **Time complexity** is *O(1)*
+ **Space complexity** is *O(1)*

---
<section class="footnotes" markdown="1">
###### Footnotes
[^1]: Problem adapted from the [Reverse Integer problem on Leetcode](https://leetcode.com/problems/reverse-integer/description/){:target="_blank"}

</section>
