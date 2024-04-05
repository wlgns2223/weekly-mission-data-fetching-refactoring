# 위클리 미션 Data Fetching 방식을 리팩토링했습니다.

1. getServerSideProps (SSR)
2. getStaticPaths + getStaticProps (SSG)

## 코드 확인시 체크아웃하세요.

```
git checkout main (원본)
git checkout getServerSideProps (SSR)
git checkout getStaticPath (SSG)
```

## 리팩토링 한 지점

-   src/ui/Category.tsx
-   pages/optional-catch/[[...folderId]].tsx

### 상황

#### 기존

-   CSR을 이용 할 때에는 folder페이지에서 페이지 이동없이 클라이언트에서 데이터를 가져오는 방식을 사용했습니다.

#### 변경점

-   SSR 또는 SSG를 사용하기 위해 folder를 페이지별로 나누었습니다.
-   멘토링에서도 말씀드렸지만 예시를 위해서 억지로 folder 페이지를 폴더 아이디별로 나누었습니다.
-   아이디별로 페이지를 나누기 위해서 **Dynamic Route**를 사용했습니다.

## 고민해볼 이슈

### getStaticPaths + getStaticProps를 사용하는 경우

-   getStaticPaths를 사용하면 미리 정의된 경로에 대한 정적 페이지를 생성할 수 있습니다. (빌드시간)
-   빌드 시간에 생성되지 못한 페이지는 404 페이지로 처리됩니다.
-   런타임시간에 새로 생긴 폴더에 대한 페이지는 어떻게 처리되어야 할까요?
