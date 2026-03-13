# 달 문자 생성기 - Moonlight Edition

> 이미지나 텍스트를 달 이모지(🌑 🌒 🌓 🌔 🌕 🌖 🌗 🌘)로 변환하는 웹 애플리케이션

<img width="2832" height="1822" alt="image" src="https://i.imgur.com/i7C7SLY.png" />

## 1. 소개 (Introduction)

이 프로젝트는 이미지나 텍스트를 달 이모지 아트로 변환하는 웹 애플리케이션입니다. 이미지 모드와 텍스트 모드를 지원하며, 다양한 렌더링 옵션을 통해 사용자가 원하는 스타일의 달 문자 아트를 생성할 수 있습니다.

렌더링 엔진에는 [wataoka/tsuki](https://github.com/wataoka/tsuki)의 4×4 블록 템플릿 매칭 알고리즘을 도입하여, 단순 밝기 매핑 대비 방향성 있는 달 이모지 배치가 가능합니다.

**주요 기능**

- **이미지 모드**: 업로드한 이미지를 달 이모지로 변환
- **텍스트 모드**: 입력한 텍스트를 달 이모지 아트로 렌더링
- **듀얼 렌더링 엔진**: 안티앨리어싱 ON/OFF에 따라 tsukimoji 템플릿 매칭(8종) 또는 이진 모드(2종)를 전환
- **실시간 조정**: 크기, 대비, 안티앨리어싱 등 다양한 옵션 실시간 조정
- **줌/팬 기능**: 결과물을 확대하고 이동하여 자세히 확인
- **클립보드 복사**: 생성된 달 문자 아트를 클립보드로 복사

## 2. 렌더링 알고리즘 (Rendering Algorithm)

### Smooth 모드 (안티앨리어싱 ON) — tsukimoji 방식

[tsukimoji](https://tsukimoji.com/) 원작자 [wataoka](https://github.com/wataoka)의 알고리즘을 JavaScript로 포팅한 방식입니다.

1. 이미지를 `(이모지 열 수 × 4)` 픽셀 너비로 리사이즈
2. 4×4 픽셀 블록 단위로 순회
3. 각 블록을 8개의 사전 정의된 밝기 패턴 행렬과 아다마르 곱(element-wise multiply) → 합산으로 유사도 비교
4. 가장 높은 점수의 달 이모지를 선택

이 방식은 "밝은 영역이 블록 내 어느 방향에 몰려 있는가"를 감지하여, 초승달(🌒)과 그믐달(🌘) 같은 좌우 비대칭 이모지를 적재적소에 배치합니다.

**사용 이모지 (8종)**

| 이모지 | 패턴 | 설명 |
|:---:|---|---|
| 🌑 | 전체 어두움 | 삭 |
| 🌒 | 오른쪽 1/4 밝음 | 초승달 |
| 🌓 | 오른쪽 반 밝음 | 상현달 |
| 🌔 | 오른쪽 3/4 밝음 | 상현 볼록달 |
| 🌘 | 왼쪽 1/4 밝음 | 그믐달 |
| 🌗 | 왼쪽 반 밝음 | 하현달 |
| 🌖 | 왼쪽 3/4 밝음 | 하현 볼록달 |
| 🌕 | 전체 밝음 | 보름달 |

### Binary 모드 (안티앨리어싱 OFF)

1픽셀 = 1이모지 방식으로, 밝기 임계값(0.5)을 기준으로 🌑 또는 🌕로 이분법 변환합니다. 커스텀 이모지 지정이 가능합니다.

## 3. 기술 스택 (Tech Stack)

- **Frontend**: HTML5, CSS3, JavaScript (ES6 Modules)
- **Styling**: Tailwind CSS (CDN)
- **Fonts**: Google Fonts (Cinzel, Montserrat, Playfair Display, Noto Sans KR)
- **Deployment**: GitHub Pages

## 4. 설치 및 실행 (Quick Start)

이 프로젝트는 정적 웹사이트로 별도의 빌드 과정이나 서버 설정이 필요하지 않습니다.

1. **로컬에서 실행**
   ```bash
   git clone [레포지토리 URL]
   cd [폴더명]
   ```
   
   `index.html` 파일을 브라우저에서 직접 열거나, 로컬 서버를 사용하여 실행합니다.
   
   ```bash
   # Python 3를 사용한 예시
   python -m http.server 8000
   ```
   
   브라우저에서 `http://localhost:8000`으로 접속합니다.

2. **GitHub Pages**
   - [달 문자 생성기](https://jtech-co.github.io/Moon-Emoji-Generator/)

## 5. 폴더 구조 (Structure)

```
달 문자 생성기 🌕/
├── css/
│   └── styles.css          # Moonlight 스타일
├── js/
│   ├── config.js           # 이모지 팔레트 및 tsukimoji 템플릿 행렬 정의
│   ├── state.js            # 상태 관리
│   ├── dom.js              # DOM 요소 참조
│   ├── spotlight.js        # Spotlight 효과
│   ├── ui.js               # UI 업데이트 함수
│   ├── imageHandler.js     # 이미지 처리
│   ├── textHandler.js      # 텍스트 모드 처리
│   ├── renderer.js         # 렌더링 핵심 로직 (tsukimoji 매칭 + 이진 모드)
│   ├── viewport.js         # 줌/팬 기능
│   ├── clipboard.js        # 클립보드 복사
│   └── main.js             # 초기화 및 이벤트 리스너
├── index.html              # 메인 HTML 파일
└── README.md               # 프로젝트 문서
```

## 6. 사용 방법 (Usage)

1. **이미지 모드**
   - IMAGE MODE 버튼 선택
   - 이미지 파일 업로드 (드래그 앤 드롭 또는 클릭)
   - 크기, 대비 등 옵션 조정

2. **텍스트 모드**
   - TEXT MODE 버튼 선택
   - 텍스트 입력 (한글, 영어, 이모지 지원)
   - 크기, 대비 등 옵션 조정

3. **렌더링 옵션**
   - **Dimensions**: 출력 크기 조정 (너비/높이)
   - **Contrast**: 대비 조정
   - **Smooth (Anti-aliasing)**: ON 시 tsukimoji 8종 템플릿 매칭, OFF 시 이진 모드 (🌑 🌕)
   - **Invert Colors**: 색상 반전
   - **Custom Characters**: 이진 모드에서 사용할 커스텀 문자 설정

4. **결과 확인**
   - 마우스 휠로 확대/축소
   - 드래그로 이동
   - COPY 버튼으로 클립보드에 복사

## 7. 크레딧 (Credits)

- **tsukimoji 변환 엔진**: [wataoka/tsuki](https://github.com/wataoka/tsuki) — 4×4 블록 템플릿 매칭 알고리즘 (MIT License)
- **월문자 제너레이터 원작**: [tsukimoji.com](https://tsukimoji.com/) by たんごこうや(@ngocoder)

## 8. 라이선스 (License)

MIT
