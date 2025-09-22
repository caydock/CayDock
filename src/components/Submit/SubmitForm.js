"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

export default function SubmitForm({ initialLanguage = 'en', searchParams = {}, initialSite = null }) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '提交失败');
      }

      const result = await response.json();
      setSubmitStatus({ type: 'success', message: t('submit.successMessage') });
      reset();
    } catch (error) {
      console.error('提交失败:', error);
      setSubmitStatus({ type: 'error', message: error.message || '提交失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{t('submit.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('submit.tagline')}</p>
        </div>

        {submitStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="link" className="block text-sm font-medium mb-2">
              {t('submit.urlLabel')} *
            </label>
            <input
              type="url"
              id="link"
              {...register("link", { 
                required: t('submit.urlInvalid'),
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: t('submit.urlInvalid')
                }
              })}
              placeholder={t('submit.urlPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            {errors.link && (
              <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              {t('submit.siteTitleLabel')}
            </label>
            <input
              type="text"
              id="title"
              {...register("title")}
              placeholder={t('submit.siteTitlePlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? t('submit.saved') : t('submit.submitBtn')}
          </button>
        </form>
      </div>
    </div>
  );
}
