# Development schedule calculator

One of the hardest tasks for software engineer is to estimate how much time it will take to tackle a certain amount of work.

// mode(minimum, plain, maximum) ===(set weight)===> weight(minimum, plain, maximum)
// weight ===(set schedule)===> calculateSchedule()
// end user ===(get schedule)===> getTotalSchedule()

## Formula based ons rule of thumb

unit: the amount of tiime that a developer thought that it would take.

Minimum: unit x1
Plain: unit x2.5
Maximum: unit x4

1. 일정 추정을 위한 일정을 만든다.
1. 작업에 대한 세부 기능을 쪼갠다.
1. 세부 기능에 대한 일정을 추정한다.
1. 세부 기능 일정의 총합이 전체 추정 일정이다.
1. 구해진 전체 일정에 x2.5를 한 후 아래 3가지 버전을 만들어 팀에게 공유한다.

schedule equals to the total sum of the followings:

1. Requirements
2. Architecture
3. Implementation
4. First Q/A
5. Code review
6. Amendment
7. Code review
8. Completion
