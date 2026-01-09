import { useState, useEffect } from 'react'
import { Save, Store, Truck, Globe, AlertCircle } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { Switch } from '@/shared/components/ui/switch'
import { useToast } from '@/shared/components/ui/use-toast'

interface Settings {
  shop_name: string
  shop_description: string
  contact_phone: string
  contact_email: string
  delivery_enabled: boolean
  delivery_price: string
  free_delivery_threshold: string
  currency: string
  telegram_bot_username: string
}

const defaultSettings: Settings = {
  shop_name: 'My Shop',
  shop_description: 'Your shop description',
  contact_phone: '+1 234 567 8900',
  contact_email: 'info@example.com',
  delivery_enabled: true,
  delivery_price: '10',
  free_delivery_threshold: '100',
  currency: 'USD',
  telegram_bot_username: 'your_bot',
}

export const SettingsPage = () => {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // TODO: Load settings from API
    // For now, use default settings
    setIsLoading(false)
  }, [])

  const handleChange = (key: keyof Settings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Save settings to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: 'Настройки сохранены',
        description: 'Изменения успешно применены',
      })
    } catch {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Настройки</h1>
          <p className="text-muted-foreground">Управление настройками магазина</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Shop Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Информация о магазине
            </CardTitle>
            <CardDescription>
              Основная информация о вашем магазине
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shop_name">Название магазина</Label>
                <Input
                  id="shop_name"
                  value={settings.shop_name}
                  onChange={(e) => handleChange('shop_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Валюта</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shop_description">Описание</Label>
              <Textarea
                id="shop_description"
                value={settings.shop_description}
                onChange={(e) => handleChange('shop_description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Контактная информация
            </CardTitle>
            <CardDescription>
              Контактные данные для связи с клиентами
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Телефон</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram_bot_username">Telegram бот</Label>
              <Input
                id="telegram_bot_username"
                value={settings.telegram_bot_username}
                onChange={(e) => handleChange('telegram_bot_username', e.target.value)}
                placeholder="@username"
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Настройки доставки
            </CardTitle>
            <CardDescription>
              Параметры доставки заказов
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <div className="font-medium">Доставка включена</div>
                <div className="text-sm text-muted-foreground">
                  Включить или отключить доставку для клиентов
                </div>
              </div>
              <Switch
                checked={settings.delivery_enabled}
                onCheckedChange={(checked) => handleChange('delivery_enabled', checked)}
              />
            </div>

            {settings.delivery_enabled && (
              <>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="delivery_price">Стоимость доставки ({settings.currency})</Label>
                    <Input
                      id="delivery_price"
                      type="number"
                      value={settings.delivery_price}
                      onChange={(e) => handleChange('delivery_price', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="free_delivery_threshold">
                      Бесплатная доставка от ({settings.currency})
                    </Label>
                    <Input
                      id="free_delivery_threshold"
                      type="number"
                      value={settings.free_delivery_threshold}
                      onChange={(e) => handleChange('free_delivery_threshold', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Warning */}
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-500">Внимание</div>
                <div className="text-sm text-muted-foreground">
                  Изменения настроек вступят в силу после сохранения. Некоторые настройки
                  могут потребовать перезапуска приложения.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
