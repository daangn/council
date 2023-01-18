import { HiExclamationTriangle } from 'react-icons/hi2';

export default function DeniedPage() {
  return (
    <div className="grid grid-rows-1 h-screen place-items-center">
      <main className="text-center">
        <h1
          className="font-bold flex items-center justify-center"
        >
          <HiExclamationTriangle
            className="h-8 w-8 text-red-600"
            aria-hidden="true"
          />
          <span
            className="pl-4 pr-8 text-2xl"
          >
            Access Denied
          </span>
        </h1>
        <p className="m-4">
          페이지에 접근할 권한이 없습니다.
          관리자에게 문의하세요.
        </p>
      </main>
    </div>
  )
}
