skip to:contentpackage searchsign in
❤
Pro
Teams
Pricing
Documentation
npm
Search packages
Search
@khmyznikov/pwa-install
TypeScript icon, indicating that this package has built-in type declarations
0.6.3 • Public • Published a month ago
Published on NPM npm

<pwa-install>
New to PWAs? Unsure how to create a Web App? Check out these resources for a quick start: PWA Intro, PWA Starter, PWA Builder

Installation dialog for Progressive Web Application (PWA) and Add to Home Screen/Dock dialog for Web Apps. This offers an enhanced user experience and addresses the absence of native dialogs in certain browsers (Safari, Firefox, Opera, etc.). 28kB brotli compressed bundle. Translation/localization is supported.

✨ Now with iOS/iPadOS/MacOS 26+ support for native look and feel!

Use it as Web Component with any modern framework. No polyfill is required.

React <= 18 sample
React 19+ sample
Next.js 15 + React 19 sample
Angular sample
Svelte
⚡Should work with any other modern framework or just vanila js as web component.

Demo
Gallery
      iOS default      	Install instruction	      App gallery       
iOS example default	iOS example install instruction	iOS example gallery
MacOS 14-26+ (Tahoe)
macos_default
    iPadOS    	Instruction
iPadOS example default	iPadOS install instruction
Android	Firefox/ Opera/ Others	  App gallery  
Android example default	Firefox Opera and others	Android gallery
Chrome 	App Gallery  
Chrome example default	Chrome example gallery

Install
npm i @khmyznikov/pwa-install
Alternatively, you can use unpkg or esm.sh.

Import
import '@khmyznikov/pwa-install';
TS Config
"compilerOptions": {
  "moduleResolution": "Bundler",
  "types": ["dom-chromium-installation-events", "web-app-manifest"]
}
Use
<pwa-install></pwa-install>
React <= 18 polyfill
React 19+ sample
Next.js 15 + React 19 sample
Demo

Supported params
<pwa-install
  manual-apple
  manual-chrome
  disable-chrome
  disable-close
  use-local-storage

  install-description="Custom call to install text"
  disable-install-description
  disable-screenshots
  disable-screenshots-apple
  disable-screenshots-chrome
  manual-how-to

  disable-android-fallback

  manifest-url="/manifest.json"
  name="PWA"
  description="Progressive web application"         
  icon="/icon.png">
</pwa-install>
<!-- 
  manual-apple/chrome params means you want to show the Dialog manually by showDialog().
  disable-chrome param is for completely disabling custom logic and interception for Chromium browsers (will work built-in browser logic).
  use-local-storage will store the user's preference to ignore the prompt in long-lived storage (so they will not be prompted again unless they clear application data)
  disable-android-fallback will disable instructions for non-Chrome browsers on Android
  manual-how-to shows the instructions right away, disabling screenshots (Apple only)
--->
Make a good manifest file and don't use name/descr/icon params. Boolean attributes needs to be removed to act like "false"

Custom Styles
Only the Apple template supports styling, and only the tint color option is available as of today. More to come.

<!-- As attribute (JSON string) -->
<pwa-install styles='{"--tint-color": "#6366f1"}'></pwa-install>
// As property (object)
const pwaInstall = document.querySelector('pwa-install');
pwaInstall.styles = { '--tint-color': '#6366f1' };

// Or as attribute via JavaScript
pwaInstall.setAttribute('styles', JSON.stringify({ '--tint-color': '#6366f1' }));

Supported events
pwa-install-success-event
pwa-install-fail-event
pwa-install-available-event
pwa-user-choice-result-event
pwa-install-how-to-event
pwa-install-gallery-event
<script type="text/javascript">
  var pwaInstall = document.getElementsByTagName('pwa-install')[0];

  pwaInstall.addEventListener('pwa-install-success-event', (event) => {console.log(event.detail.message)});
</script>
⚠️ success/fail/choice events is Chromium only, iOS don't have them.

⚠️ If you see this message in the console:
Banner not shown: beforeinstallpromptevent.preventDefault() called. The page must call beforeinstallpromptevent.prompt() to show the banner.
This is not a error and not a bug. This means that the component successfully intercepted the beforeinstallprompt event.


Supported properties (readonly)
userChoiceResult: string
isDialogHidden: boolean
isInstallAvailable: boolean
isAppleMobilePlatform: boolean
isAppleDesktopPlatform: boolean
isApple26Plus: boolean
isUnderStandaloneMode: boolean
isRelatedAppsInstalled: boolean
<script type="text/javascript">
  var pwaInstall = document.getElementsByTagName('pwa-install')[0];

  console.log(pwaInstall.isUnderStandaloneMode);
</script>

Supported methods
install
hideDialog
showDialog
getInstalledRelatedApps: async
<script type="text/javascript">
  var pwaInstall = document.getElementsByTagName('pwa-install')[0];

  pwaInstall.install();
</script>
getInstalledRelatedApps is Chromium only, always empty on iOS.


Async mode
If you need to target Chromium browsers but you want to postpone component mounting, you can do it! But, need to capture beforeinstallprompt manually and pass it to the component's externalPromptEvent property(not attribute).

// capture event asap, better right in index.html script tag
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  // save it somewhere
  window.promptEvent = e;
});

// later render the component on demand and pass event
document.getElementById("pwa-install").externalPromptEvent = window.promptEvent;

Supported localization
Translations available: EN, RU, TR, DE, ES, NL, EL, FR, SR, PL, ZH-CN/ZH-HK, IT, UK, CS, NO/NB, PT, JA, SV, KO, KM, DA, VI, FA, HU, SK, CA-ES, HE

Language should change automatically based on browser settings. Please create the pull-request if you want to help with translation to your language. It's an easy process.

Contribution Guidelines


ROADMAP
manual theme
buy me a coffee QR PayPal QR

One-time Backers ❤️
Patrick Voigt
Darren Debono
Angelo Fan
Chris Cherniakov
Moddy
Pavlo Hromadchuk
Leek Duck

Readme
Keywords
PWAlit-elementlit
Package Sidebar
Install
npm i @khmyznikov/pwa-install


Repository
github.com/khmyznikov/pwa-install

Homepage
github.com/khmyznikov/pwa-install#readme

Weekly Downloads
32,457

Version
0.6.3

License
MIT

Unpacked Size
1.33 MB

Total Files
58

Last publish
a month ago

Collaborators
khmyznikov
Analyze security with SocketCheck bundle sizeView package healthExplore dependencies
Report malware
Footer
Support
Help
Advisories
Status
Contact npm
Company
About
Blog
Press
Terms & Policies
Policies
Terms of Use
Code of Conduct
Privacy
Viewing @khmyznikov/pwa-install version 0.6.3