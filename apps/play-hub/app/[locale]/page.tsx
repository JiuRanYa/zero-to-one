'use client'

import { games } from '@/config/games'
import { GameCard } from '@/components/games/game-card'

export default function IndexPage() {
  // const controllerRef = use3DEffect<HTMLDivElement>({
  //   intensity: 4,
  //   perspective: 1200,
  //   smooth: 0.25
  // })

  return (
    <section className="container grid items-center gap-6">
      {/* <div className="relative flex flex-row items-center gap-8 py-12 my-12"> */}
      {/* <div className="flex flex-col gap-4">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              网页游戏百集
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              一个网页游戏合集，包括数独、2048、俄罗斯方块等各类游戏。
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              target="_blank"
              rel="noreferrer"
              href={siteConfig.links.github}
              className={buttonVariants({ variant: 'outline' })}
            >
              GitHub
            </Link>
            <Link
              href={'/games/2048'}
              rel="noreferrer"
              className={buttonVariants()}
            >
              现在玩
            </Link>
          </div>
        </div>
        <div ref={controllerRef} className="hidden md:block absolute right-[15%] preserve-3d">
          <Image
            src="/game-controller.png"
            alt="Game Controller"
            width={220}
            height={220}
            priority
          />
        </div>
      </div> */}

      <div className="mt-12">
        <h1 className="mb-6 text-2xl font-bold">游戏列表</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </section>
  )
}
