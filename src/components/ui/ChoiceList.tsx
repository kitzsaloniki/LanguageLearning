import styles from './ChoiceList.module.css'

export interface Choice<T extends string> {
  value: T
  title: string
  description?: string
  /** BCP 47 tag of the title when it is written in another language. */
  lang?: string
  /** Short marker shown before the title, e.g. a CEFR level. */
  badge?: string
}

interface ChoiceListProps<T extends string> {
  label: string
  choices: readonly Choice<T>[]
  value: T | undefined
  onChange: (value: T) => void
}

/** A vertical list of large, tappable single-choice cards. */
export function ChoiceList<T extends string>({
  label,
  choices,
  value,
  onChange,
}: ChoiceListProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={styles.list}>
      {choices.map((choice) => (
        <ChoiceCard
          key={choice.value}
          choice={choice}
          isSelected={choice.value === value}
          onSelect={() => onChange(choice.value)}
        />
      ))}
    </div>
  )
}

interface ChoiceCardProps<T extends string> {
  choice: Choice<T>
  isSelected: boolean
  onSelect: () => void
}

function ChoiceCard<T extends string>({ choice, isSelected, onSelect }: ChoiceCardProps<T>) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      className={isSelected ? `${styles.choice} ${styles.selected}` : styles.choice}
      onClick={onSelect}
    >
      {choice.badge && <span className={styles.badge}>{choice.badge}</span>}
      <span className={styles.text}>
        <span className={styles.title} lang={choice.lang}>
          {choice.title}
        </span>
        {choice.description && <span className={styles.description}>{choice.description}</span>}
      </span>
      <span className={styles.indicator} aria-hidden="true" />
    </button>
  )
}
