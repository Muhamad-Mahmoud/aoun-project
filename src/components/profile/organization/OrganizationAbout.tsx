import React from 'react';
import { FileText, Tag, Globe } from 'lucide-react';
import { ProfileCard } from '../shared/ProfileCard';
import { ProfileSection } from '../shared/ProfileSection';
import { ProfileField } from '../shared/ProfileField';
import { OrganizationProfile } from '@/types/profile';

interface OrganizationAboutProps {
    profile: OrganizationProfile;
}

export const OrganizationAbout: React.FC<OrganizationAboutProps> = ({ profile }) => {
    return (
        <ProfileCard>
            <ProfileSection
                title="نبذة عن الجمعية"
                icon={<FileText className="w-3.5 h-3.5" />}
            >
                <div className="space-y-4">
                    {profile.about && (
                        <ProfileField
                            label="الوصف"
                            value={profile.about}
                            vertical
                        />
                    )}

                    {profile.workAreas && profile.workAreas.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-base font-bold text-foreground">مجالات العمل</p>
                            <div className="flex flex-wrap gap-2">
                                {profile.workAreas.map((area, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-semibold"
                                    >
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {profile.socialMedia && (
                        <div className="space-y-2">
                            <p className="text-base font-bold text-foreground">وسائل التواصل الاجتماعي</p>
                            <div className="grid md:grid-cols-3 gap-3">
                                {profile.socialMedia.facebook && (
                                    <a
                                        href={profile.socialMedia.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-[#1877F2]/10 text-[#1877F2] rounded-lg hover:bg-[#1877F2]/20 transition-colors"
                                    >
                                        <Globe className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Facebook</span>
                                    </a>
                                )}
                                {profile.socialMedia.twitter && (
                                    <a
                                        href={profile.socialMedia.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-lg hover:bg-[#1DA1F2]/20 transition-colors"
                                    >
                                        <Globe className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Twitter</span>
                                    </a>
                                )}
                                {profile.socialMedia.instagram && (
                                    <a
                                        href={profile.socialMedia.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 bg-[#E4405F]/10 text-[#E4405F] rounded-lg hover:bg-[#E4405F]/20 transition-colors"
                                    >
                                        <Globe className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Instagram</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </ProfileSection>
        </ProfileCard>
    );
};
