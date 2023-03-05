# [모빙](https://www.mobing.co.kr/) 사용량 조회 위젯 for [Scriptable](https://scriptable.app/)
<img src="https://user-images.githubusercontent.com/72844671/222945990-23fcedfd-3ee5-41e0-a1ea-3a9619cb1d5c.png" width="300"/>

대한민국의 별정통신사(MVNO) [모빙](https://www.mobing.co.kr/)의 휴대전화 요금제 사용량을 편리하게 조회할 수 있는 위젯입니다.   
iPhone에서 [Scriptable](https://scriptable.app/) 앱에 추가하여 위젯으로 사용할 수 있습니다.  

> 본 저장소(SalaryTheft/MobingWidget)에서 제공하는 설명 및 파일은 모빙((주)유니컴즈)가 제공하는 것이 아닙니다.   
> 신뢰도, 완성도, 정확도 등의 어떠한 보증 없이 있는 그대로 제공되며, 사용에 대한 책임은 사용자 본인에게 있습니다.   

## 1. 서비스 계정 확인 (택1)
### 방법 1. 모빙 홈페이지에서 확인
> 모빙 홈페이지 계정이 필요하며 브라우저 개발자 도구를 사용할 줄 알아야 합니다.
- 모빙 홈페이지 [가입 정보 페이지](https://www.mobing.co.kr/my-page/register-info) 접속
- 브라우저의 개발자 도구(F12)를 열고 네트워크 탭, XHR 요청만 표시하도록 필터링
<img src="https://user-images.githubusercontent.com/72844671/222946339-5237050a-0a29-4bf5-9cc4-fc6fc0b106d0.png" width="600"/>

- 로그인 후 getAccountInfo에 보낸 요청에 대한 응답에서 serviceAccount 확인 (이미 로그인 되어 있었다면 새로고침 후 확인)
<img src="https://user-images.githubusercontent.com/72844671/222946218-174e583f-8095-43b4-9d2b-329a6a0f93b0.png" width="600"/>


### 방법 2. mobing.py 사용
> 고객센터 앱의 문자 인증 방법을 똑같게 구현한 간단한 Python 스크립트입니다.   
> Python 3.x 실행 환경이 갖추어져 있다면 [mobing.py](mobing.py)를 바로 사용하면 되고,   
> 그렇지 않다면 [배포 파일(.exe)](dist/mobing.exe)를 실행하여 사용하실 수 있습니다.   

![image](https://user-images.githubusercontent.com/72844671/222946788-d99fb92d-f454-4d1d-bd43-fcd8a7060984.png)


## 2. 위젯 추가 및 설정
- [Scriptable](https://scriptable.app/)이 설치된 iPhone에서 Safari(또는 다른 브라우저)로 mobing.js 파일을 엽니다.
> https://raw.githubusercontent.com/SalaryTheft/MobingWidget/master/mobing_widget.js
- 전체 선택 후 복사 - Scriptable 앱 실행 - 새 Script(우측 상단 +) - 붙혀넣기 - 저장(좌측 상단 Done)
- 필요에 따라 방금 추가된 스크립트(Untitled Script)를 길게 눌러 이름 변경
- 홈 화면에 위젯 추가 후 길게 눌러서 추가했던 스크립트 선택, 파라미터에 서비스 계정 입력
<img src="https://user-images.githubusercontent.com/72844671/222946892-c5366ec2-a529-45be-b70c-60c556a53639.png" width="300"/>

- 위젯의 새로고침 주기는 전적으로 iOS에 의해 결정되며 보통 5분이며, 위젯이 화면에 자주 표시되지 않는 경우 그보다 길 수 있습니다.
