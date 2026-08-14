"use client";

import React, { useEffect } from "react";
import Script from "next/script";
import { useTrackingTags } from "@/context/TrackingTagsContext";

export function DynamicTrackingHead() {
  const { config } = useTrackingTags();

  return (
    <>
      {/* 1. Global DataLayer Initialization */}
      <Script
        id="bravo-datalayer-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
        }}
      />

      {/* 2. Google Tag Manager (GTM) Container */}
      {config.gtmEnabled && config.gtmId && (
        <Script
          id="bravo-gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${config.gtmId}');
            `,
          }}
        />
      )}

      {/* 3. Google Analytics 4 (GA4) */}
      {config.ga4Enabled && config.ga4Id && (
        <>
          <Script
            id="bravo-ga4-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${config.ga4Id}`}
          />
          <Script
            id="bravo-ga4-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                gtag('config', '${config.ga4Id}', {
                  page_path: window.location.pathname,
                  send_page_view: true
                });
              `,
            }}
          />
        </>
      )}

      {/* 4. Google Ads Conversion ID */}
      {config.googleAdsEnabled && config.googleAdsConversionId && (
        <Script
          id="bravo-google-ads-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              gtag('config', '${config.googleAdsConversionId}');
            `,
          }}
        />
      )}

      {/* 5. Meta Pixel (Facebook / Instagram) */}
      {config.metaPixelEnabled && config.metaPixelId && (
        <Script
          id="bravo-meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${config.metaPixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* 6. TikTok Pixel */}
      {config.tiktokPixelEnabled && config.tiktokPixelId && (
        <Script
          id="bravo-tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${config.tiktokPixelId}');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      )}

      {/* 7. Microsoft Clarity */}
      {config.clarityEnabled && config.clarityProjectId && (
        <Script
          id="bravo-clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${config.clarityProjectId}");
            `,
          }}
        />
      )}

      {/* 8. Hotjar Tracking Code */}
      {config.hotjarEnabled && config.hotjarSiteId && (
        <Script
          id="bravo-hotjar-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${config.hotjarSiteId},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      )}

      {/* 9. Domain Verification Meta Tags */}
      {config.metaDomainVerificationEnabled && config.metaDomainVerification && (
        <meta
          name="facebook-domain-verification"
          content={config.metaDomainVerification.replace(/.*content=["']?([^"'>\s]+)["']?.*/i, "$1").trim()}
        />
      )}
      {config.googleSiteVerificationEnabled && config.googleSiteVerification && (
        <meta
          name="google-site-verification"
          content={config.googleSiteVerification.replace(/.*content=["']?([^"'>\s]+)["']?.*/i, "$1").trim()}
        />
      )}
      {config.bingSiteVerificationEnabled && config.bingSiteVerification && (
        <meta
          name="msvalidate.01"
          content={config.bingSiteVerification.replace(/.*content=["']?([^"'>\s]+)["']?.*/i, "$1").trim()}
        />
      )}

      {/* 10. Custom Verified Head Scripts */}
      {config.customHeadScriptEnabled && config.customHeadScript && (
        <Script
          id="bravo-custom-head-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: config.customHeadScript.replace(/<\/?script[^>]*>/gi, ""),
          }}
        />
      )}
    </>
  );
}

export function DynamicTrackingBodyNoScript() {
  const { config } = useTrackingTags();

  return (
    <>
      {/* GTM NoScript */}
      {config.gtmEnabled && config.gtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${config.gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager Noscript"
          />
        </noscript>
      )}

      {/* Meta Pixel NoScript */}
      {config.metaPixelEnabled && config.metaPixelId && (
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${config.metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </>
  );
}
