import {applicationConfig, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {TabBarPreviewComponent} from "./tab-bar-preview/tab-bar-preview.component";
import {provideRouter} from "@angular/router";

export default {
  title: 'Tab Bar',
  component: TabBarPreviewComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
    applicationConfig({
      providers: [provideRouter([])]
    })
  ]
} satisfies Meta;

type Story = StoryObj<TabBarPreviewComponent>;

export const Default: Story = {
  render: (args) => ({props: args}),
};
