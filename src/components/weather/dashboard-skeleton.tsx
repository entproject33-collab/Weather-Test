import { Atmosphere } from './atmosphere'
import { Logo } from './ui'

export function DashboardSkeleton() {
  return (
    <div className="skyline-app">
      <Atmosphere />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1240px] flex-col px-4 pb-10 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center gap-3 py-5 sm:py-6">
          <Logo className="mr-auto" />
          <div className="order-2 flex w-full items-center gap-2 md:order-1 md:w-auto">
            <div className="skeleton h-11 flex-1 rounded-full md:w-72" />
            <div className="skeleton size-11 rounded-full" />
          </div>
          <div className="skeleton order-1 h-9 w-[96px] rounded-full md:order-2" />
        </header>

        <main className="mt-2 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          <div className="skeleton h-[390px] rounded-3xl lg:col-span-8" />
          <div className="skeleton h-[390px] rounded-3xl lg:col-span-4" />
          <div className="skeleton h-[290px] rounded-3xl lg:col-span-12" />
          <div className="skeleton h-[470px] rounded-3xl lg:col-span-7" />
          <div className="grid gap-4 lg:col-span-5">
            <div className="skeleton h-[240px] rounded-3xl" />
            <div className="skeleton h-[210px] rounded-3xl" />
          </div>
        </main>

        <div className="skeleton mt-6 h-3.5 w-56 rounded-full" />
        <p role="status" className="sr-only">
          Loading weather dashboard…
        </p>
      </div>
    </div>
  )
}
