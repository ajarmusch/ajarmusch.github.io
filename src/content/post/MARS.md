---
title: "Motor Algorithmic Regulation System (MARS) "
description: "How I Built Better Noise Reduction Algorithms for Space Missions"
publishDate: "May 2023"
draft: false
---

# Engineering for Mars: How I Built Better Noise Reduction Algorithms for Space Missions

When I started my senior design project at the University of Delaware, I expected to build something for my portfolio. What I didn't expect was to develop noise reduction algorithms that could help future Mars rovers operate more efficiently in the harsh environment of space.

## The Challenge: Reducing Weight for Space Travel

Working with aerospace giant Northrop Grumman, my team and I tackled a deceptively complex problem. Every ounce matters when sending equipment to Mars, and the company's resolver encoders—devices that determine motor position—required heavy noise-canceling materials to function properly. The question was: could better algorithms reduce the need for this physical shielding?

We were constrained by the physical design of the model since we needed to know precisely how the resolver was being used with the other components of the mission. This real-world constraint forced us to focus on software solutions rather than hardware modifications.

## Building a Mars Rover Simulator on Earth

My approach was to be as thorough as possible. Rather than working purely in simulation, we constructed a physical apparatus that mirrored Northrop Grumman's actual system. Our setup included:

- A DC brushless motor controlled by an Arduino
- A resolver to measure motor position
- Custom 3D-printed mounting hardware that I designed
- Electronic speed controllers and signal processing equipment

This hands-on approach allowed us to validate our algorithms against real-world conditions, not just theoretical models.

## Three Algorithms, Three Different Approaches

The core of my work involved developing and testing three distinct resolver encoder algorithms in MATLAB Simulink:

### 1. Phase-Locked Loop (PLL) Encoder
This traditional approach uses feedback control to track motor position. While effective, it showed some oscillations that I worked to minimize through gain adjustments.

### 2. Third-Order Rational Polynomial Encoder
This algorithm approximates the arctangent function using polynomial mathematics. It proved to be our most successful approach, providing smooth position tracking with minimal computational overhead.

### 3. S-Transform Encoder
Using Fourier transforms, this method offered high accuracy but at a significant computational cost, making it impractical for space applications where processing power is limited.

## Real Results for Real Problems

My work produced tangible outcomes. The third-order polynomial algorithm, in particular, showed significant promise in reducing noise while maintaining accuracy. Northrop Grumman provided positive feedback on our deliverables, validating the practical applicability of our research.

Beyond the algorithms themselves, this project taught me the value of industry-academic partnerships. I gained exposure to real engineering constraints—from non-disclosure agreements to hardware limitations—while contributing to actual space mission technology.

## Lessons in Collaborative Engineering

Working with Northrop Grumman presented unique challenges that classroom projects rarely provide. I had to:

- Navigate corporate communication channels and NDAs
- Work within existing hardware constraints I couldn't modify
- Balance academic timelines with industry expectations
- Translate theoretical knowledge into practical solutions

Working with Northrop Grumman was challenging because of the constant communication back and forth that occurs over email instead of just having to communicate with our group members. This experience highlighted how real-world engineering requires strong communication skills alongside technical expertise.

## Looking Forward

While I also explored machine learning approaches using recurrent neural networks, I found that traditional algorithmic solutions often provide the best balance of performance and reliability for space applications. This insight reflects a broader truth in engineering: the most advanced solution isn't always the most appropriate one.

The project's success lies not just in the algorithms I developed, but in demonstrating how university students can contribute meaningfully to cutting-edge space technology. As private companies and NASA continue pushing toward Mars exploration, projects like these show that the next generation of engineers is ready to tackle the challenges ahead.


- [View Presentation (PDF)](/MARS/mars_presentation.pdf)
- [Download Full Paper (PDF)](/MARS/mars_report.pdf)
- [View Poster (PDF)](/MARS/mars_poster.pdf)

---

*The Motor Algorithmic Regulation System (MARS) project was completed as a senior design capstone at the University of Delaware in collaboration with Northrop Grumman Corporation. The team's work contributes to ongoing efforts to make space exploration more efficient and cost-effective through advanced computational approaches.*
