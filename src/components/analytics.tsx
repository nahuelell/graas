import Script from "next/script";

/** Google Analytics 4: se activa solo si está cargada NEXT_PUBLIC_GA_ID. */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(!a)return;var h=a.getAttribute('href')||'';
if(h.indexOf('wa.me')>-1)gtag('event','click_whatsapp',{link_url:h});else if(h.indexOf('tel:')===0)gtag('event','click_telefono');else if(h.indexOf('mailto:')===0)gtag('event','click_email');});`}
      </Script>
    </>
  );
}
