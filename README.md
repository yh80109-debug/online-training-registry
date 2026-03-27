# 온라인 연수 등록부

QR코드로 참석자가 휴대폰에서 접속해 소속, 직위, 이름을 입력하고 손글씨 서명을 남길 수 있는 Next.js + Supabase 프로젝트입니다.

## 포함 기능

- 행사 생성 페이지
- 행사별 참석자 등록 페이지
- 손글씨 전자서명
- 행사별 관리자 등록부 페이지
- 관리자 비밀번호 확인
- 공개 URL 기반 QR코드 표시
- 인쇄용 등록부 출력

## 1. 로컬 실행

### 1) 패키지 설치

```bash
npm install
```

### 2) 환경변수 설정

`.env.example`을 복사해서 `.env.local`로 만듭니다.

```bash
cp .env.example .env.local
```

그 다음 값을 채웁니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3) Supabase SQL 실행

Supabase SQL Editor에서 `supabase-schema.sql` 파일 내용을 실행합니다.

### 4) 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

---

## 2. 화면 구조

- `/` 홈
- `/admin/create-event` 행사 생성
- `/registry/[eventId]` 참석자 입력 + 서명
- `/admin/registry/[eventId]` 관리자 등록부

---

## 3. Vercel 배포 방법

### 방법 A. GitHub 연동 배포

1. 이 프로젝트를 GitHub 저장소로 올립니다.
2. Vercel에 로그인합니다.
3. **Add New Project**를 눌러 GitHub 저장소를 가져옵니다.
4. Framework는 자동으로 Next.js로 인식됩니다.
5. **Environment Variables**에 아래 4개를 추가합니다.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
6. `NEXT_PUBLIC_APP_URL`에는 실제 배포 도메인을 넣습니다.
   - 예: `https://your-project.vercel.app`
7. Deploy를 누릅니다.

### 방법 B. Vercel CLI 배포

```bash
npm i -g vercel
vercel login
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL
vercel deploy
```

배포가 끝난 뒤 production으로 올릴 때는 아래를 실행합니다.

```bash
vercel --prod
```

---

## 4. QR코드가 공개 URL을 가리키게 하는 방법

이 프로젝트는 QR코드를 만들 때 `NEXT_PUBLIC_APP_URL` 값을 기준으로 참석자 URL을 생성합니다.

예를 들어:

```env
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

이렇게 설정하면 QR코드는 아래 주소를 가리킵니다.

```txt
https://your-project.vercel.app/registry/{eventId}
```

즉, 로컬 미리보기 주소가 아니라 **배포된 공개 주소**가 QR코드에 들어갑니다.

---

## 5. 실제 사용 순서

1. `/admin/create-event`에서 행사 생성
2. 생성된 참석자 URL 확인
3. 행사장 안내문에 QR코드 배치
4. 참석자가 휴대폰으로 등록
5. 관리자가 `/admin/registry/[eventId]`에서 비밀번호 입력 후 등록부 확인 및 인쇄

---

## 6. 주의사항

현재 버전은 빠른 배포용 MVP입니다.

- 관리자 비밀번호는 `events` 테이블에 평문으로 저장됩니다.
- 운영 고도화 시에는 비밀번호 해시 저장으로 바꾸는 것이 좋습니다.
- 참가자가 매우 많으면 CSV 내보내기, 검색, 페이지네이션 기능을 추가하면 좋습니다.
- 더 강한 보안을 원하면 Supabase Auth 또는 별도 관리자 로그인 체계를 붙이는 것이 좋습니다.
