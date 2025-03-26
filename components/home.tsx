"use client"

import { useTranslation } from "@/i18n/hooks"

export default function Home() {
  const { t } = useTranslation()
  
  return (
    <>
      <section className="container py-12 md:py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("ourMotorcycles")}</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            {t("ourMotorcyclesDesc")}
          </p>
        </div>
        {/* Rest of the content */}
      </section>

      <section className="container py-12 md:py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("motorcycleAvailability")}</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            {t("checkAvailabilityAndPrice")}
          </p>
        </div>
        {/* Rest of the content */}
      </section>

      <section className="container py-12 md:py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("blog")}</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            {t("blogDesc")}
          </p>
        </div>
        {/* Rest of the content */}
      </section>

      <section className="container py-12 md:py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("contactUs")}</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            {t("contactUsDesc")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{t("sendMessageToUs")}</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">{t("name")}</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">{t("email")}</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">{t("phoneOptional")}</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">{t("subject")}</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">{t("message")}</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors"
                >
                  {t("sendMessage")}
                </button>
              </form>
            </div>
          </div>
          <div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{t("contactInformation")}</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium mb-2">{t("phone")}</h4>
                  <p className="text-gray-400">+1 (234) 567-8900</p>
                  <p className="text-gray-400">+1 (234) 567-8901</p>
                </div>
                <div>
                  <h4 className="text-md font-medium mb-2">{t("email")}</h4>
                  <p className="text-gray-400">info@motocruise.com</p>
                  <p className="text-gray-400">support@motocruise.com</p>
                </div>
                <div>
                  <h4 className="text-md font-medium mb-2">{t("address")}</h4>
                  <p className="text-gray-400">123 Ride Street</p>
                  <p className="text-gray-400">Bike City, BC 12345</p>
                  <p className="text-gray-400">United States</p>
                </div>
                <div>
                  <h4 className="text-md font-medium mb-2">{t("businessHours")}</h4>
                  <p className="text-gray-400">{t("mondayToFriday")}</p>
                  <p className="text-gray-400">{t("saturdayHours")}</p>
                  <p className="text-gray-400">{t("sundayClosed")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 