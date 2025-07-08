import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  GameConfig, 
  DEFAULT_GAME_CONFIG, 
  Difficulty,
  DIFFICULTY_PRESETS 
} from './game-utils'
import { useTranslations } from 'next-intl'
import { ChangeEvent, useEffect } from 'react'

interface DifficultySettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentConfig: GameConfig
  onConfigChange: (config: GameConfig) => void
}

interface FormData extends GameConfig {
  difficulty: Difficulty
}

const configSchema = z.object({
  difficulty: z.enum(['easy', 'normal', 'hard', 'expert', 'custom'] as const),
  FOUR_PROBABILITY: z.number().min(0).max(1),
  INITIAL_TILES: z.number().min(1).max(6),
  GRID_SIZE: z.number().min(3).max(8),
  WIN_VALUE: z.number().min(128).max(16384)
})

export function DifficultySettingsModal({
  open,
  onOpenChange,
  currentConfig,
  onConfigChange
}: DifficultySettingsModalProps) {
  const t = useTranslations('2048')
  
  // 根据当前配置判断难度
  function getCurrentDifficulty(config: GameConfig): Difficulty {
    for (const [difficulty, preset] of Object.entries(DIFFICULTY_PRESETS)) {
      if (
        preset.FOUR_PROBABILITY === config.FOUR_PROBABILITY &&
        preset.INITIAL_TILES === config.INITIAL_TILES &&
        preset.GRID_SIZE === config.GRID_SIZE &&
        preset.WIN_VALUE === config.WIN_VALUE
      ) {
        return difficulty as Exclude<Difficulty, 'custom'>
      }
    }
    return 'custom'
  }

  const form = useForm<FormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      ...currentConfig,
      difficulty: getCurrentDifficulty(currentConfig)
    },
  })

  // 监听难度变化
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'difficulty' && value.difficulty !== 'custom') {
        const preset = DIFFICULTY_PRESETS[value.difficulty as Exclude<Difficulty, 'custom'>]
        form.setValue('FOUR_PROBABILITY', preset.FOUR_PROBABILITY)
        form.setValue('INITIAL_TILES', preset.INITIAL_TILES)
        form.setValue('GRID_SIZE', preset.GRID_SIZE)
        form.setValue('WIN_VALUE', preset.WIN_VALUE)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // 监听其他配置项变化，更新难度为自定义
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && name !== 'difficulty') {
        const currentDifficulty = getCurrentDifficulty(value as GameConfig)
        if (currentDifficulty !== form.getValues('difficulty')) {
          form.setValue('difficulty', 'custom')
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = (values: FormData) => {
    const { ...config } = values
    onConfigChange(config)
    onOpenChange(false)
  }

  const resetToDefault = () => {
    form.reset({
      ...DEFAULT_GAME_CONFIG,
      difficulty: 'normal'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('settings.title')}</DialogTitle>
          <DialogDescription>
            {t('settings.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.difficulty')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('settings.selectDifficulty')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">{t('settings.difficulties.easy')}</SelectItem>
                      <SelectItem value="normal">{t('settings.difficulties.normal')}</SelectItem>
                      <SelectItem value="hard">{t('settings.difficulties.hard')}</SelectItem>
                      <SelectItem value="expert">{t('settings.difficulties.expert')}</SelectItem>
                      <SelectItem value="custom">{t('settings.difficulties.custom')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('settings.difficultyDesc')}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="FOUR_PROBABILITY"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.fourProbability')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      {...field}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('settings.fourProbabilityDesc')}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="INITIAL_TILES"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.initialTiles')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="6"
                      {...field}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('settings.initialTilesDesc')}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="GRID_SIZE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.gridSize')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="3"
                      max="8"
                      {...field}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('settings.gridSizeDesc')}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="WIN_VALUE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.winValue')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="128"
                      max="16384"
                      step="128"
                      {...field}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('settings.winValueDesc')}
                  </FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={resetToDefault}>
                {t('settings.resetToDefault')}
              </Button>
              <Button type="submit">{t('settings.save')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 