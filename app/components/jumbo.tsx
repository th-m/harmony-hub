import { ChartPieIcon, NewspaperIcon, SparklesIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Automate Weekly Reports',
    description:
      'Give your manager reports detailing everything you did, and how long it took with a simple click of a button.',
    href: '#',
    icon: NewspaperIcon,
  },
  {
    name: 'Find Habit Patterns',
    description:
      'Explore your data and discover interesting relations between habits, for example see how sleep effects your code time.',
    href: '#',
    icon: ChartPieIcon,
  },
  {
    name: 'Optimize Productivity',
    description:
      'The data shown is best used as "lead measures" they help show if you are on track toward meeting your goal.',
    href: '#',
    icon: SparklesIcon,
  },
]

export function Jumbo() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">How Software Developers Level Up</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Boost Your Productivity.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
        By consolidating personal trackers and development tools Harmony Hub boosts productivity and simplifies task management. It integrates seamlessly, streamlines workflows, and keeps your projects on track. Welcome to a more harmonious way of managing your tasks.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                  {/* <p className="mt-6">
                    <a href={feature.href} className="text-sm font-semibold leading-6 text-indigo-400">
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p> */}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
