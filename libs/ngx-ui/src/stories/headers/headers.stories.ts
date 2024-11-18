import {applicationConfig, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {HeadersPreviewComponent} from "./headers-preview/headers-preview.component";
import {UIScopeConfig, UIScopeContext} from "../../models/ui-scope";
import {provideRouter} from "@angular/router";

const defaultConfig: UIScopeConfig = {
  default: {
    showMenu: true,
    class: 'main',
    child: {
      class: 'sub',
      tabScope: {
        class: 'tab',
        child: {
          class: 'sub-tab'
        }
      },
      child: {
        class: 'sub-sub',
        child: {
          class: 'sub-sub-sub',
          child: {
            class: 'sub-sub-sub-sub'
          }
        }
      }
    }
  }
}

export default {
  title: 'Headers',
  component: HeadersPreviewComponent,
  render: (args) => ({props: args}),
  decorators: [
    moduleMetadata({
      imports: [],
    }),
    applicationConfig({
      providers: [UIScopeContext.Provide(defaultConfig), provideRouter([])]
    })
  ]
} satisfies Meta;

type Story = StoryObj<HeadersPreviewComponent>;

export const Default: Story = {};
