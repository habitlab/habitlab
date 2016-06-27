# habitlab-chrome

This is the Chrome extension for HabitLab

## Install

Ensure that you have [git](https://git-scm.com/) and [nodejs](https://nodejs.org/en/) (6.2.2 or higher) installed.

```
git clone git@github.com:habitlab/habitlab-chrome.git
cd habitlab-chrome
npm install
npm install -g gulp
gulp
```

Now you will have the chrome extension built in the `dist` directory. You can sideload it using the [extensions developer tool](https://chrome.google.com/webstore/detail/chrome-apps-extensions-de/ohmmkhmmmpcnpikjeljgnaoabkaalbgc)

## Adding an intervention

First add an directory under the [`src/interventions`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions) directory. It should contain 2 files: `info.yaml` and `frontend.ls`. Follow [`google/blue_background`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions/google/blue_background) as an example of how these files should look like.

Then, edit the file [`src/interventions/interventions.yaml`](https://github.com/habitlab/habitlab-chrome/blob/master/src/interventions/interventions.yaml) and add the path to your intervention relative to the [`src/interventions`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions) directory.
