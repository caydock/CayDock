---
title: "Becoming an Excellent Frontend Engineer"
date: 2019-11-23 22:29:33
draft: false
translationKey: "becoming-excellent-frontend-engineer"
---

## Background

This year's year-end summary came a bit early. Taking advantage of having just changed companies, I'll share my thoughts on frontend development over the past year.

First, I started learning frontend development in college and was determined to pursue it. I felt that doing frontend development was fun and rewarding, so I jumped into the field. Taking advantage of the mobile internet mass innovation environment, from internship to graduation to full-time employment, and then changing jobs twice, the journey has been relatively smooth. I didn't encounter major obstacles in job hunting, and now I think I've been doing frontend development for four years (including internship). But it's precisely because of this "smoothness" that I, including many frontend colleagues, have overlooked many things we should possess as frontend engineers.

By this year, the mobile internet dividend has gradually disappeared, the global economy has declined, many companies have closed down, and layoffs have left many people jobless or struggling to find work. Including this time, I prepared for a long time before deciding to go out and try opportunities. During the interview process, situations like this would occur: although the other party felt you were already very good, they would still make you wait a long time before giving you a response, and some HRs even called me directly to say, "We're still comparing, we'll give you an offer later."

So in the current environment, to avoid being abandoned by the times and take control of career development, thinking about becoming an excellent and outstanding frontend engineer has become particularly important. The following are my reflections.

## How to Become an Excellent Frontend Engineer

This topic actually has many people's own summaries, including the industry expert Kejun's internal sharing ["Talking with Team About Personal Growth"](/posts/talking-with-team-about-personal-growth-kejun-repost/). I've read it several times, and each time I gain deep insights. Speaking of becoming an excellent frontend engineer, I very much agree with the description about growth, which includes **objective factors** and **subjective factors**. Below, I'll share my thoughts on these two aspects.

### Objective Factors

If you're familiar with JavaScript, you know there's a `this` variable that points to the environmental context. The same method, with different `this` pointing, returns different content. This is the power of environment. Similarly, the same person, in different environments, will have different growth directions and progress.

I chose to start interning at a small startup company before graduation. At that time, I felt excited because this company was very vibrant, and the department leaders were very capable. I learned a lot at this company and grew quickly. But looking back, I think how great it would have been if I could have interned at a large company at that time. Many questions on Zhihu discuss whether it's better to join a large company or a small company after graduation. At that time, I was also confused and didn't realize the importance of this issue.

#### 1. **Company Environment**
- **Large companies** provide:
  - **Stable technology stack** - Mature frameworks and tools
  - **Learning opportunities** - Access to senior engineers and best practices
  - **Career growth** - Clear promotion paths and skill development
  - **Resource access** - Better tools, training, and support
  - **Network building** - Connections with industry professionals

- **Small companies** offer:
  - **Rapid learning** - Exposure to multiple technologies
  - **Ownership** - More responsibility and decision-making
  - **Flexibility** - Ability to try new approaches
  - **Direct impact** - See immediate results of your work
  - **Entrepreneurial experience** - Understanding of business operations

#### 2. **Team Environment**
- **Mentorship** - Learning from experienced developers
- **Code reviews** - Improving code quality through feedback
- **Collaboration** - Working with diverse skill sets
- **Knowledge sharing** - Regular tech talks and discussions
- **Culture** - Learning-focused and supportive environment

#### 3. **Project Environment**
- **Complexity** - Challenging projects that push boundaries
- **Scale** - Large-scale applications with performance requirements
- **Diversity** - Different types of projects and technologies
- **Innovation** - Opportunities to try new technologies
- **Impact** - Projects that matter to users and business

### Subjective Factors

#### 1. **Technical Skills**
- **Core Technologies** - HTML, CSS, JavaScript fundamentals
- **Frameworks** - React, Vue, Angular, and their ecosystems
- **Tools** - Build tools, testing frameworks, version control
- **Performance** - Optimization techniques and best practices
- **Accessibility** - Building inclusive user experiences

#### 2. **Learning Attitude**
- **Continuous learning** - Staying updated with new technologies
- **Curiosity** - Asking questions and exploring new ideas
- **Experimentation** - Trying new approaches and technologies
- **Documentation** - Reading and writing technical documentation
- **Community involvement** - Participating in open source and conferences

#### 3. **Problem-Solving Skills**
- **Analytical thinking** - Breaking down complex problems
- **Debugging** - Systematic approach to finding and fixing issues
- **Research** - Finding solutions through documentation and community
- **Creativity** - Thinking outside the box for innovative solutions
- **Persistence** - Not giving up when facing difficult challenges

#### 4. **Communication Skills**
- **Technical writing** - Clear documentation and code comments
- **Presentation** - Explaining technical concepts to non-technical stakeholders
- **Collaboration** - Working effectively with team members
- **Mentoring** - Helping junior developers grow
- **Feedback** - Giving and receiving constructive feedback

## Key Areas for Growth

### 1. **Technical Depth**
```javascript
// Understanding JavaScript fundamentals
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}
```

### 2. **System Design**
- **Architecture patterns** - MVC, MVVM, Component-based
- **State management** - Redux, Vuex, Context API
- **Data flow** - Unidirectional data flow principles
- **Scalability** - Designing for growth and maintenance
- **Performance** - Optimizing for speed and efficiency

### 3. **User Experience**
- **Design principles** - Understanding of UX/UI best practices
- **Accessibility** - WCAG guidelines and inclusive design
- **Performance** - Core Web Vitals and optimization
- **Responsive design** - Mobile-first and cross-device compatibility
- **User testing** - Gathering feedback and iterating

### 4. **Business Understanding**
- **Product mindset** - Understanding user needs and business goals
- **Metrics** - Measuring success and impact
- **Stakeholder communication** - Working with product managers and designers
- **Cost-benefit analysis** - Making informed technical decisions
- **Market awareness** - Understanding industry trends and competition

## Career Development Strategies

### 1. **Skill Development**
- **Technical skills** - Master core technologies and frameworks
- **Soft skills** - Communication, leadership, and collaboration
- **Domain knowledge** - Understanding the business and industry
- **Continuous learning** - Staying updated with new technologies
- **Specialization** - Becoming an expert in specific areas

### 2. **Network Building**
- **Professional connections** - Building relationships with industry peers
- **Mentorship** - Finding mentors and being a mentor
- **Community involvement** - Participating in meetups and conferences
- **Open source** - Contributing to projects and building reputation
- **Online presence** - Blogging, speaking, and sharing knowledge

### 3. **Career Planning**
- **Goal setting** - Defining short-term and long-term objectives
- **Skill assessment** - Identifying strengths and areas for improvement
- **Learning path** - Creating a structured approach to skill development
- **Portfolio building** - Showcasing work and achievements
- **Market research** - Understanding job market and opportunities

### 4. **Personal Brand**
- **Online presence** - Professional profiles and portfolios
- **Content creation** - Blogging, speaking, and sharing insights
- **Thought leadership** - Contributing to industry discussions
- **Reputation building** - Delivering quality work and results
- **Networking** - Building relationships with industry professionals

## Common Pitfalls to Avoid

### 1. **Technical Debt**
- **Quick fixes** - Prioritizing speed over quality
- **Outdated practices** - Not updating skills and approaches
- **Poor documentation** - Lack of clear code comments and documentation
- **Testing neglect** - Not writing tests or maintaining test coverage
- **Performance issues** - Ignoring optimization and best practices

### 2. **Career Stagnation**
- **Comfort zone** - Not challenging yourself with new projects
- **Skill plateau** - Not learning new technologies or approaches
- **Limited exposure** - Not working with different teams or projects
- **Poor networking** - Not building professional relationships
- **Lack of visibility** - Not showcasing your work and achievements

### 3. **Communication Issues**
- **Technical jargon** - Not explaining concepts clearly to non-technical stakeholders
- **Poor documentation** - Unclear code comments and documentation
- **Limited feedback** - Not seeking or providing constructive feedback
- **Isolation** - Not collaborating effectively with team members
- **Presentation skills** - Not being able to present ideas clearly

## Best Practices for Growth

### 1. **Learning Strategy**
- **Structured learning** - Following a curriculum or learning path
- **Hands-on practice** - Building projects and applying knowledge
- **Community engagement** - Participating in discussions and forums
- **Mentorship** - Learning from experienced developers
- **Teaching others** - Solidifying knowledge through teaching

### 2. **Skill Development**
- **Core fundamentals** - Mastering HTML, CSS, and JavaScript
- **Framework expertise** - Becoming proficient in React, Vue, or Angular
- **Tool proficiency** - Mastering build tools, testing frameworks, and version control
- **Performance optimization** - Learning optimization techniques
- **Accessibility** - Understanding inclusive design principles

### 3. **Career Advancement**
- **Goal setting** - Defining clear career objectives
- **Skill assessment** - Regularly evaluating strengths and weaknesses
- **Network building** - Building relationships with industry professionals
- **Portfolio development** - Showcasing work and achievements
- **Continuous improvement** - Always looking for ways to grow

## Conclusion

Becoming an excellent frontend engineer requires a combination of:

### **Objective Factors:**
1. **Right environment** - Company, team, and project context
2. **Learning opportunities** - Access to mentors and resources
3. **Challenging projects** - Opportunities to grow and learn
4. **Supportive culture** - Environment that encourages growth

### **Subjective Factors:**
1. **Technical skills** - Core competencies and expertise
2. **Learning attitude** - Curiosity and continuous improvement
3. **Problem-solving** - Analytical thinking and creativity
4. **Communication** - Clear expression and collaboration

### **Key Strategies:**
1. **Continuous learning** - Stay updated with new technologies
2. **Skill development** - Master core technologies and frameworks
3. **Network building** - Build relationships with industry professionals
4. **Career planning** - Set goals and create learning paths
5. **Personal brand** - Build reputation and showcase work

### **Final Thoughts:**
The frontend development landscape is constantly evolving, and success requires adaptability, continuous learning, and a growth mindset. By focusing on both technical skills and soft skills, building a strong network, and maintaining a learning attitude, you can become an excellent frontend engineer who thrives in any environment.

Remember: excellence is not a destination but a journey of continuous improvement and growth. The key is to stay curious, keep learning, and always strive to be better than you were yesterday.