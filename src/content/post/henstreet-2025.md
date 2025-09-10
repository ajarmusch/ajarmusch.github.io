---
title: "SallieMae College ROI Model"
description: "How I Built a College ROI Calculator at HenStreet Hacks 2025"
publishDate: "20 August 2025"
draft: false
---


# How I Built a College ROI Calculator at HenStreet Hacks 2025

This past summer, I had the incredible opportunity to participate in the HenStreet Hackathon at the University of Delaware, working on a project that would tackle one of the biggest financial decisions students face: choosing the right college major and degree level based on return on investment.

## The Problem We Set Out to Solve

The statistics are staggering - over 19.57 million students are attending more than 5,000 higher education institutions this fall. Yet despite these massive numbers, most students take out loans without clear, personalized insights into their potential ROI. College is expensive, and students deserve better data to make smarter borrowing decisions.

Working alongside my talented teammates Jacob Whitman, Nihaal Chowdary Surpani, Samuel Zheng, and Aaron Jarmusch, and with guidance from our Sallie Mae mentors Michele Mullowney, Andrew De Angelo, and Mark Stueve, we set out to change that.

## Our Solution: "Get A Doctorate"

We developed an interactive tool that combines national datasets (College Scorecard, IPEDS, FREOPP) into a personalized, data-driven platform. What makes our approach original isn't just showing averages - we used machine learning to predict custom ROI based on a student's specific school, major, and degree choice.

### Key Features We Built:
- **Clean, mobile-optimized dashboard** for easy access on any device
- **Side-by-side program comparisons** to evaluate different paths
- **Personalized metrics** tailored to individual majors and schools  
- **Current loan payment insights** linking degree ROI with real repayment scenarios
- **AI-powered recommendations** for informed decision-making

## The Technical Journey

Our tech stack leveraged modern cloud infrastructure and data processing tools. We used Google Cloud Platform for hosting, BigQuery for data processing, XGBoost for our machine learning models, and React for the frontend interface. The backend was containerized with Docker and deployed on Google Cloud Run.

The biggest challenge? Data integration. We initially planned to combine multiple public datasets, but the formats and structures didn't align well. This taught us an important lesson about real-world data work - sometimes you need to pivot and focus on doing one thing exceptionally well rather than trying to merge incompatible sources.

## What We Delivered

In just three days, we created:
1. A fully functional interactive dashboard visualizing ROI by major, degree level, and institution
2. Machine learning models predicting personalized outcomes
3. A comparison tool showing scenario modeling for different career paths

The tool calculates key metrics like break-even points, projected income ranges, and total investment costs, giving students the concrete data they need to make informed decisions about their educational investments.

## Lessons Learned

This hackathon reinforced that building meaningful solutions requires both technical skills and deep understanding of user needs. Students don't just want generic statistics - they want personalized insights that reflect their unique circumstances and goals.

Working with Sallie Mae's mentors also showed me how industry partnerships can enhance student projects, bringing real-world context and potential implementation pathways that wouldn't exist in academic isolation.

## Looking Forward

While we accomplished a lot in three days, this project highlighted the ongoing need for better financial literacy tools in higher education. The intersection of data science, financial planning, and educational accessibility offers rich opportunities for future development.

The hackathon experience was invaluable - combining rapid prototyping, teamwork under pressure, and the satisfaction of building something that could genuinely help students make better financial decisions about their futures.

*This project was completed as part of the HenStreet Hackathon at the University of Delaware, using only publicly available datasets.*

- [View Presentation (PDF)](/HenStreet/henstreethacks-salliemae.pdf)
