import {Provider, Type} from '@angular/core';
import {ICON_PROVIDER} from "./services/icon-provider.service";
import {IconProvider} from "./models/icon-providers";
import {IconService} from "./services/icon.service";

function provideService(iconService?: Type<IconService>): Provider[] {
  if (!iconService) return [IconService]

  return [
    iconService,
    {provide: IconService, useExisting: iconService},
  ];
}

export const provideIcons = {

  fromFontAwesome: (iconService?: Type<IconService>): Provider[] => [
    {provide: ICON_PROVIDER, useValue: IconProvider.FontAwesome},
    ...provideService(iconService)
  ],

  fromMaterial: (iconService?: Type<IconService>): Provider[] => [
    {provide: ICON_PROVIDER, useValue: IconProvider.Material},
    ...provideService(iconService)
  ],

} as const;
