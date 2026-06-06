# ⚔️ 카드 로그 (Card Rogue) - 고대연대기 에디션

**카드 로그 (Card Rogue)**는 Slay the Spire 스타일의 복고풍 고딕 누아르 로그라이크 덱 빌더 웹 게임입니다. 
이 저장소는 Next.js / React 및 Express 프레임워크 기반의 풀스택 아키텍처로 설계되어 있으며, Supabase 등 PostgreSQL 서비스와 연동할 수 있는 실시간 점수 판정 및 글로벌 랭킹 시스템을 제공합니다.

---

## 📅 전체 프로젝트 구조 (Vite + React / Express Fullstack)

```txt
card-rogue-deckbuilder/
├── dist/                          # 프로덕션 빌드 패키지 출력 경로
├── src/
│   ├── assets/
│   │   └── images/                # 미적 비전 1인칭 POV 고스 일러스트 에물레이션
│   ├── components/
│   │   └── GameScreen.tsx         # 핵심 게임 화면, 실시간 전투 및 랭킹 모듈 통합
│   ├── data/
│   │   ├── cards.ts               # 카드 타입별 공격, 방막, 영성 회복 데이터 및 드래프트 가단
│   │   ├── enemies.ts             # 기본 성채몬스터, 정예군단, 심연 마왕 인텐트 알고리즘
│   │   └── local_rankings.json    # 데이베이스 부재 시 자동 작동하는 파일 DB 백업
│   ├── index.css                  # Cinzel/Lora 글꼴 바인딩 및 올드 파치먼트 테일윈드 테마
│   ├── main.tsx                   # 프론트엔드 엔트리포인트
│   └── types.ts                   # 가용 상태 관리 인터페이스 정의
├── .env.example                   # 환경 설정 템플릿 파일
├── .gitignore                     # Git 관리 제외 대상 등록
├── index.html                     # 정적 웹페이지 마크업
├── package.json                   # 종속 패키지 및 풀스택 복합 빌드 스크립트
├── server.ts                      # Express API 서버 및 개발 전용 Vite HMR 프록시 미들웨어
├── tsconfig.json                  # 엄격한 타입 세이프티 정적 분석 옵션
├── vite.config.ts                 # 빌드 정밀 스위칭 플러그인 바인더
└── deployment-config.json         # 클라우드 호스팅 배포 설정 파일
```

---

## ⚡ 설치 명령어 (Installation)

로컬 개발 환경을 초기 설정하기 위해 프로젝트 루트 디렉터리에서 다음 명령을 실행합니다:

```bash
# 종속 패키지 일괄 패킹 설치
npm install
```

---

## ⚙️ 환경변수 설정 (Environment Variables)

프로젝트 루트에 `.env` 파일을 생성하고 아래 형식을 모방하여 키 값을 저장하십시오. 
*보안 주의: 비공개 데이터베이스 연동 비밀 키는 이 파일에만 작성하고 절대 커밋하지 마십시오.*

```env
# 배포 호스팅 URL 자가 인지 주소
APP_URL="http://localhost:3000"

# Supabase 데이터베이스 접속 키 (입력되지 않은 경우 서버측 JSON 백업 파일로 자동 전향 복귀 작동)
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="your-anon-role-key"
```

---

## 🗄️ 데이터베이스 테이블 및 보안 정책 SQL

Supabase SQL Query Editor 또는 외부 PostgreSQL 콘솔에서 아래 스크립트를 사용하여 전설 명예의 전당 테이블을 생성하십시오. Row Level Security(RLS) 보안 정책이 함께 명시되어 외부 부정 개입을 규합합니다.

```sql
-- 1. 랭킹 데이터 수집 전용 가용 테이블 생성
create table rankings (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  score int not null,
  stage int not null,
  survived boolean not null default false,
  play_time int not null, -- (초 단위 기록)
  created_at timestamptz default now()
);

-- 2. 행 레벨 RLS 보안 활성화
alter table rankings enable row level security;

-- 3. 익명 및 게스트를 포함한 전 인원의 조회 허가 정책 선포
create policy "Anyone can view rankings"
on rankings
for select
using (true);

-- 4. 게임 종료 시 누구나 점수 등록을 수행하도록 통행 정책 허용
create policy "Anyone can insert rankings"
on rankings
for insert
with check (true);
```

---

## 🗃️ 주요 코드 파일 아키텍처 정보

1. **`server.ts`**:
   - Express 서버 엔진. 배포 플랫폼에서 프론트엔드 렌더러와 공존할 수 있도록 **Vite Middleware** 개발 방식 적용.
   - `/api/rankings` 엔드포인트를 노출하여 클라이언트가 API 키를 직접 브라우저에 드러내지 않도록 완벽 엄폐 프록싱.
2. **`src/components/GameScreen.tsx`**:
   - 덱빌딩 플레이 및 랭커 분석 뷰가 유려한 골드 바인딩 레이아웃으로 통합되었습니다.
   - API와 실시간 통신하여 원활하게 고대연대기 랭킹을 로드 및 투고합니다.
3. **`src/data/cards.ts` & `src/data/enemies.ts`**:
   - 카드 인스턴스 전술, 드랩 팩토리 설계 가이드 및 보초병 턴제 행동 시퀸스를 구성합니다.

---

## 🎮 카드 전투 및 점수 계산 알고리즘 설명

### 1단계: 플레이어 전투 흐름
* **에너지 시스템**: 매 턴 기본 플레이어 에너지 3 지급. 가치별 코스트 소비.
* **드로우 시스템**: 전투 카드 무작위 셔플 후 5장을 손에 들며, 덱이 소진될 시 드로우 풀이 자동 리사이클링됩니다.

### 2단계: 에너미 인텐트(Intent Engine)
* 적의 머리 위에 다음 턴에 예정된 기공 참격(공격), 방벽 수비(블록), 암흑 기합(힘 영구충전) 등이 직관적인 아지랑이 수치로 미리 고지됩니다. 플레이어는 이를 확인하고 선제 연격을 수행할지, 합금 철벽을 세워 HP 감쇄를 봉쇄할지 결정합니다.

### 3단계: 점수 산출 로직 (`scoring`)
게임 종료(전멸 패배 상황 혹은 30 관문 사가 클리어 개선 완수) 시 다음 공식에 기초하여 업적이 영광스러운 Glory Point로 산출됩니다:
```txt
최종 점수 =
  전투 승리 축적 점수 (기본 승리당 150점)
  + 생존 체력 여분율 보너스
  + 클리어 스테이지 공헌도 (도달한 스테이지 수 × 120)
  + 무결 콤보 퍼펙트 전투 잔여 (피해 없이 완벽 클리어당 180점 추가 수여)
  + 크레딧 사가 개선 클리어 대보너스 (3,500점)
  + 소지 잔여 골드 보상 (보관 골드의 절반 수치 1:0.5 가산 교환)
```

---

## 🚀 로컬 테스트 및 실행 방법

아래 명령어를 사용하여 Express API 서버와 백엔드 자원을 가동합니다. Vite의 모든 소스 수정사항은 Express를 타고 `localhost:3000`에 연계 전송됩니다.

```bash
# 풀스택 개발 모드 시동 (tsx 및 vite 프록싱 활성)
npm run dev
```

---

## 🐙 GitHub 원격 저장소 업로드 방법

소스 코드를 원격 저장소에 반영해 보존하려면 다음 명령을 순서대로 투입하십시오:

```bash
# 1. 로컬 저장소 깃 마운트 지정
git init

# 2. 제외 대상 외 전체 파일 적재 등록
git add .

# 3. 마일스톤 커밋 발행
git commit -m "Initialize Card Rogue client-server full-stack game with Supabase connector"

# 4. 원격 저장소 가지 수립 및 브랜치 명명
git branch -M main
git remote add origin https://github.com/YOUR_GIT_ID/card-game.git

# 5. 최종 소스 발송 푸시
git push -u origin main
```

---

## 🌍 프로덕션 클라우드 배포 방법 (Vercel, Render)

### Option A: Vercel 배포 (프론트/백엔드 동시 제공)
Vercel은 `server.ts` 구동 방식을 Serverless Functions로 매핑할 수 있습니다.
1. Vercel 대시보드에서 `Import Project` 선택.
2. 환경 설정 단계에서 `SUPABASE_URL`, `SUPABASE_ANON_KEY`를 Environment Variables에 바인딩 대기.
3. Deploy 완료 후 배포 생성 도메인에 방문하여 정상 플레이 가동 점검.

### Option B: Render, Railway, Cloud Run 컨테이너 배포
정식 풀스택 지속 프로세스를 보장하려는 가장 강력하고 정석적인 대안입니다.
1. `npm run build` 스크립트를 활용해 esbuild를 실행하여 Node.js 독립 가동 CJS 파일인 `dist/server.cjs`를 준비시킵니다.
2. 배포 인스턴스 설정 페이지에서 Start Command를 `npm run start`로 대입하십시오.
3. 배포 환경 인물에서 `PORT=3000`을 설정하면 정상 연계 작동합니다.

---

## 🔌 실시간 데이터베이스 연동 및 마이그레이션 방법

1. **연동 자동화 장치**: 본 프로젝트의 `server.ts`는 복합 아키텍처로 작동합니다. 서버 측 기동 시 `.env` 또는 배포 설정 환경 변수에서 `SUPABASE_URL` 환경 변수들의 할당 여부를 자동 판독합니다.
2. **연동 여부 차이**:
   - **연동 성공 시**: 랭킹을 백엔드로 가져올 때 Supabase PostgreSQL 데이터베이스 `rankings` 테이블로부터 최신 10명의 순위를 실시간 서치 조회해 제공하며, 사용자가 명예의 전당 등록 제출 단추를 가를 시 실제 Supabase DB 인코딩 행에 전송 기록됩니다.
   - **비연동 시**: 안전망으로 서술된 로컬 서버 호스트 파일 데이터인 `src/data/local_rankings.json`에 지속 백그라운드 기입 및 보존되므로, 테스트 전 과정에서 중단 없이 유연한 수거 점수가 완벽 작동합니다.

---

## 💡 성능 강화 및 추가 확장성 개선 아이디어

1. **상태 관리의 Zustand 이전**: 컴포넌트 내부 스테이트들이 고도 확장됨에 맞춰, `store/gameStore.ts` 형태의 Zustand 조율 장치로 분할 수립하면 전역 디버깅이 윤택해집니다.
2. **Gemini AI 기반 마법 서사 영매 작용**: 카드 로그라이크에 Gemini 생성 API를 장입하여 사용자가 캠프파이어 유적에서 연금술 룬 인챈트를 적용할 때, 룬의 구성에 맞춘 전설 영웅 텍스트 모험 lore를 인물 맞춤형으로 무제한 실시간 생성하도록 확장 설계하십시오.
3. **PVP 비동기 고스트 데이터 전송**: 랭킹 테이블에 플레이어가 승리 시 수집한 최종 덱 뭉치 정보를 JSON 직렬화 배열 문자열 형식으로 함께 등록한 뒤, 랭킹 리스트에서 승자 이름을 가르면 그 기사가 정벌한 전술 덱 일람 카드 구성을 다른 도전자들이 투시해 모방 전수 받을 수 있는 기능.
